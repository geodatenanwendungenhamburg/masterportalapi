/* eslint-disable no-underscore-dangle */
import {GPX} from "ol/format.js";
import {Circle} from "ol/geom.js";
import {fromCircle} from "ol/geom/Polygon.js";
import {WKT} from "ol/format.js";
import Feature from "ol/Feature.js";
import {isObject, transformPoint, transformGeometry} from "./utils.js";

/**
 * Transforms the given line or polygon coordinates from a given source projection to EPSG:4326.
 *
 * @param {String} sourceProjectionCode Source projection code (e.g. "EPSG:25832").
 * @param {(Array<number>|Array<Array<number>>|Array<Array<Array<number>>>)} coords Coordinates.
 * @param {Boolean} isPolygon Determines whether the given coordinates are a polygon or a line.
 * @returns {(Array<number>|Array<Array<number>>|Array<Array<Array<number>>>)} Transformed coordinates.
 */
function transform (sourceProjectionCode, coords, isPolygon) {
    const transCoords = [];

    for (const value of coords) {
        if (isPolygon) {
            if (coords.length > 1) {
                transCoords.push(transform(sourceProjectionCode, value, isPolygon)[0]);
            }
            else {
                value.forEach(point => {
                    if (point.length > 2) {
                        transCoords.push(transform(sourceProjectionCode, point, isPolygon));
                    }
                    else {
                        transCoords.push(transformPoint(sourceProjectionCode, point));
                    }
                });
                continue;
            }
        }
        else if (value.length > 2 && !isPolygon) {
            transCoords.push(transform(sourceProjectionCode, value, isPolygon));
        }
        else {
            transCoords.push(transformPoint(sourceProjectionCode, value));
        }
    }
    return isPolygon ? [transCoords] : transCoords;
}

/**
 * Transforms the given geometry from a source projection to EPSG:4326.
 * If the geometry type is not supported (LineString, Point, or Polygon), an empty array is returned.
 *
 * @param {module:ol/geom/Geometry} geometry Geometry to be transformed.
 * @param {String} projection The source EPSG projection code.
 * @returns {(Array<number>|Array<Array<number>>|Array<Array<Array<number>>>)} The transformed coordinates or an empty array.
 */
function transformCoordinates (geometry, projection) {
    const coords = geometry.getCoordinates(),
        type = geometry.getType();

    switch (type) {
        case "LineString":
            return transform(projection, coords, false);
        case "Point":
            return transformPoint(projection, coords);
        case "Polygon":
            return transform(projection, coords, true);
        default:
            return [];
    }
}

/**
 * Adds draw state extensions to GPX feature nodes.
 * @param {String} gpxData The generated GPX document.
 * @param {ol/Feature[]} features The features written to the document.
 * @returns {String} The GPX document with draw state extensions.
 */
function addGpxDrawStateExtensions (gpxData, features) {
    const document = new DOMParser().parseFromString(gpxData, "text/xml"),
        featureNodes = Array.from(document.getElementsByTagName("*"))
            .filter(node => ["wpt", "rte", "trk"].includes(node.localName)),
        drawStateNamespace = "https://masterportal.org/gpx";

    featureNodes.forEach((featureNode, index) => {
        const drawState = features[index].get("masterportal_attributes")?.drawState;

        if (!isObject(drawState)) {
            return;
        }

        const extensions = document.createElementNS(document.documentElement.namespaceURI, "extensions"),
            drawStateNode = document.createElementNS(drawStateNamespace, "masterportal:drawState");

        drawStateNode.textContent = JSON.stringify(drawState);
        extensions.appendChild(drawStateNode);
        featureNode.appendChild(extensions);
        document.documentElement.setAttribute("xmlns:masterportal", drawStateNamespace);
    });

    return new XMLSerializer().serializeToString(document);
}

/**
 * Converts the features from OpenLayers Features to features in the chosen format,
 * transforming coordinates from the given projection to EPSG:4326.
 *
 * @param {ol/Feature[]} features The features to be converted.
 * @param {module:ol/format} format Format in which the features should be written.
 * @param {String} projection The source EPSG projection code.
 * @returns {String} The features written in the chosen format as a String.
 */
function convertFeatures (features, format, projection) {
    const convertedFeatures = [];
    let notSupportedGeometryType = false;

    for (const feature of features) {
        const cloned = feature.clone(),
            transCoords = transformCoordinates(cloned.getGeometry(), projection);

        if (transCoords.length === 3 && transCoords[2] === 0) {
            transCoords.pop();
        }

        cloned.getGeometry().setCoordinates(transCoords, "XY");
        convertedFeatures.push(cloned);

        if (format instanceof GPX && feature.getGeometry().getType() === "Polygon") {
            notSupportedGeometryType = true;
        }
    }

    if (notSupportedGeometryType) {
        console.warn("Some features could not be exported because their geometry type is not supported by the chosen format.");
    }

    const dataString = format.writeFeatures(convertedFeatures);

    return format instanceof GPX ? addGpxDrawStateExtensions(dataString, features) : dataString;
}

/**
 * Prepares features for download by cloning them and converting Circle geometries
 * to Polygons, storing circle metadata in masterportal_attributes.
 *
 * @param {ol/Feature[]} features The features to prepare.
 * @param {String} code The source EPSG projection code.
 * @returns {ol/Feature[]} The prepared features.
 */
function prepareFeatures (features, code) {
    const downloadFeatures = [];

    features.forEach((drawnFeature) => {
        const feature = drawnFeature.clone(),
            geometry = feature.getGeometry();

        if (geometry instanceof Circle || geometry.getType() === "Circle") {
            feature.setGeometry(fromCircle(geometry));
            transformGeometry(code, geometry);
            feature.set("masterportal_attributes", Object.assign(feature.get("masterportal_attributes") ?? {}, {
                "isGeoCircle": true,
                "geoCircleCenter": geometry.getCenter().join(","),
                "geoCircleRadius": geometry.getRadius()
            }));
        }
        downloadFeatures.push(feature);
    });
    return downloadFeatures;
}

/**
 * Sets the geometry of each feature as WKT and the EPSG code to its csv_attributes.
 *
 * @param {ol/Feature[]} features An array of features.
 * @param {String} code The EPSG code in which the features are coded.
 * @returns {ol/Feature[]|Boolean} The features incl. the WKT geometries. False if the given parameter is not an array.
 */
export function setCsvAttributes (features, code) {
    if (!Array.isArray(features)) {
        return false;
    }
    const wktParser = new WKT();

    features.forEach(feature => {
        if (feature instanceof Feature) {
            let geom = feature.getGeometry();

            if (geom instanceof Circle) {
                geom = fromCircle(geom);
            }
            const wktGeometry = wktParser.writeGeometry(geom);

            if (!isObject(feature.get("csv_attributes"))) {
                feature.set("csv_attributes", {});
            }
            feature.get("csv_attributes").geometry = wktGeometry;
            feature.get("csv_attributes").epsg = code;

            Object.keys(feature.getProperties()).forEach(key => {
                if (!["masterportal_attributes", "geometry", "csv_attributes"].includes(key)) {
                    feature.get("csv_attributes")[key] = feature.get(key);
                }
            });
        }
    });

    return features;
}

export default {
    convertFeatures,
    transform,
    transformPoint,
    transformGeometry,
    transformCoordinates,
    prepareFeatures,
    setCsvAttributes
};