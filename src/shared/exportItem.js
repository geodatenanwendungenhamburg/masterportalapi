/* eslint-disable no-underscore-dangle */
import {GPX} from "ol/format.js";
import {Circle} from "ol/geom.js";
import {fromCircle} from "ol/geom/Polygon.js";
import {WKT} from "ol/format.js";
import Feature from "ol/Feature.js";
import {isObject, transformPoint, transformGeometry} from "./utils.js";

/**
 * Transforms the given line or polygon coordinates from a given source projection to EPSG:4326.
 * @param {String} sourceProjectionCode source projection.
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
 * requests the transformPoint function for each individual point
 * @param {String} sourceProjectionCode source projection.
 * @param {Number[]} coords Coordinates.
 * @returns {Number[]} Transformed coordinates.
 */
function transformMultiPoint (sourceProjectionCode, coords) {
    const multiPoint = [];

    coords.forEach(point =>{
        multiPoint.push(transformPoint(sourceProjectionCode, point));
    });
    return multiPoint;
}

/**
 * Transforms the given geometry from EPSG:25832 to EPSG:4326.
 * If the geometry is not an instance of ol/LineString, ol/Point or ol/Polygon an Alert is send to the user.
 * @param {module:ol/geom/Geometry} geometry Geometry to be transformed.
 * @param {String} projection The EPSG projection that is used.
 * @returns {(Array<number>|Array<Array<number>>|Array<Array<Array<number>>>)} The transformed Geometry or an empty array.
 */
function transformCoordinates (geometry, projection) {
    const coords = geometry.getCoordinates(),
        type = geometry.getType();

    console.warn("in transformCoordinates", projection);
    switch (type) {
        case "LineString":
            return transform(projection, coords, false);
        case "Point":
            return transformPoint(projection, coords);
        case "Polygon":
            return transform(projection, coords, true);
        default:
            console.warn("Error, here used to be an alert");
            return [];
    }
}

/**
 * Converts the features from OpenLayers Features to features in the chosen format.
 * @param {Object} features the features to be converted
 * @param {module:ol/format} format Format in which the features should be saved.
 * @param {String} projection The EPSG projection that is used.
 * @returns {String} The features written in the chosen format as a String.
 */
async function convertFeatures (features, format, projection) {

    const convertedFeatures = [];
    let notSupportedGeometryType = false,
        supportedGeometryType = false;

    for (const feature of features) {
        const cloned = feature.clone(),
            transCoords = await transformCoordinates(cloned.getGeometry(), projection);

        if (transCoords.length === 3 && transCoords[2] === 0) {
            transCoords.pop();
        }

        cloned.getGeometry().setCoordinates(transCoords, "XY");
        convertedFeatures.push(cloned);

        if (format instanceof GPX && feature.getGeometry().getType() === "Polygon") {
            notSupportedGeometryType = true;
        }
        else {
            supportedGeometryType = true;
        }
    }

    if (notSupportedGeometryType && supportedGeometryType) {
        console.warn("notSupportedGeometryType && supportedGeometryType");
        // commit("setDownloadFeaturesNotSupported", false);
        // dispatch("Alerting/addSingleAlert", notSupportedAlert, {root: true});
    }
    else if (notSupportedGeometryType) {
        console.warn("notSupportedGeometryType");
        // commit("setDownloadFeaturesNotSupported", true);
        // dispatch("Alerting/addSingleAlert", allGeometryTypesNotSupported, {root: true});
    }
    else {
        console.warn("No error");
        // commit("setDownloadFeaturesNotSupported", false);
    }

    return format.writeFeatures(convertedFeatures);
}

function prepareFeatures (features) {
    const downloadFeatures = [];

    features.forEach((drawnFeature) => {
        const feature = drawnFeature.clone(),
            geometry = feature.getGeometry();

        // Jas: following lines have been moved to ExportItem.vue in MP
        // If the feature is invisible from filter, the style will be reset by printing.
        /* if (!feature.get("masterportal_attributes").isVisible && feature.get("masterportal_attributes").invisibleStyle) {
            feature.setStyle(feature.get("masterportal_attributes").invisibleStyle);
        } */

        // Following is part of the preparation in actionsDownload, needs to be revised.
        /*         if (state.oldStyle && typeof state.selectedFeature?.get === "function"
            && drawnFeature.get("masterportal_attributes").styleId === state.selectedFeature.get("masterportal_attributes").styleId
            && (typeof drawnFeature.get("masterportal_attributes").styleId === "number" || typeof drawnFeature.get("masterportal_attributes").styleId === "string")
        ) {
            feature.setStyle(state.oldStyle);
        } */

        if (geometry instanceof Circle) {
            feature.setGeometry(fromCircle(geometry));
            // transform after setting geometry, transformed coordinates are only for center and radius
            transformGeometry("EPSG:25832", geometry);
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
 * Sets the geometry of each feature as WKT and epsg to its attributes.
 * @param {ol/Feature[]} features - An array of features.
 * @param {String} code The EPSG-Code in which the features are coded.
 * @returns {ol/Feature[]|Boolean} The features incl. the wkt geometries. False if the given parameter is not an array.
 */
export function setCsvAttributes (features, code) {
    if (!Array.isArray(features)) {
        return false;
    }
    const wktParser = new WKT();

    features.forEach(feature => {
        if (feature instanceof Feature) {
            const wktGeometry = wktParser.writeGeometry(feature.getGeometry());

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
    transformMultiPoint,
    transformPoint,
    transformGeometry,
    transformCoordinates,
    prepareFeatures
};