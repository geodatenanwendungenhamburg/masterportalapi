/* eslint-disable no-underscore-dangle */
import {KML} from "ol/format.js";
import Feature from "ol/Feature.js";
import proj4 from "proj4";
import {fromCircle} from "ol/geom/Polygon.js";
import {Circle} from "ol/geom.js";
import {isObject, projections, colorOptions, allCompareEqual, transformGeometry} from "./utils.js";

/**
 * Creates the IconStyle-Part of a Point-KML. Contains the link to a SVG.
 *
 * @see https://developers.google.com/kml/documentation/kmlreference#iconstyle
 * @param {String} url URL from where the Icon can be retrieved from.
 * @param {Number} scale Scale of the Icon. NOTE: If this value is 0, the Icon is not displayed.
 * @returns {String} The IconStyle-Part of a KML-File.
 */
function createKmlIconStyle (url, scale) {
    const scaleTag = `<scale>${scale}</scale>`,
        href = `<href>${url}</href>`;

    return `<IconStyle>${scaleTag}<Icon>${href}</Icon></IconStyle>`;
}

/**
 * If the given color is included in the color options of the Draw Tool the name of the color is returned.
 *
 * @param {Number[]} color The color of which the name is to be retrieved.
 * @returns {String} The name of the color corresponding to the number array.
 */
function getIconColor (color) {
    const selectedOption = colorOptions.filter(option => allCompareEqual(color, option.value));

    if (selectedOption && selectedOption[0]) {
        return selectedOption[0].color;
    }
    return "";
}

/**
 * Constructs the hotspot-tag (anchoring of the icon) of an IconStyle-Part of a Point-KML.
 *
 * @see https://developers.google.com/kml/documentation/kmlreference#hotspot
 * @param {Object} anchor Values for the hotspot-tag are retrieved from this object.
 * @returns {String} hotspot-Tag for a KML IconStyle.
 */
function getKmlHotSpotOfIconStyle (anchor) {
    const x = anchor.anchor[0],
        y = anchor.anchor[1],
        {xUnit, yUnit} = anchor;

    return `<hotSpot x="${x}" y="${y}" xunits="${xUnit}" yunits="${yUnit}" />`;
}

/**
 * Transforms the given point coordinates from EPSG:25832 to EPSG:4326.
 *
 * @param {Number[]} coords Coordinates.
 * @returns {Number[]} Transformed coordinates.
 */
function transformPoint (coords) {
    return proj4(projections.sourceProj, projections.destProj, coords);
}

/**
 * Transforms the given line or polygon coordinates from EPSG:25832 to EPSG:4326.
 *
 * @param {(Array<number>|Array<Array<number>>|Array<Array<Array<number>>>)} coords Coordinates.
 * @param {Boolean} isPolygon Determines whether the given coordinates are a polygon or a line.
 * @returns {(Array<number>|Array<Array<number>>|Array<Array<Array<number>>>)} Transformed coordinates.
 */
function transform (coords, isPolygon) {
    const transCoords = [];

    // NOTE(roehlipa): The polygon parts look like they would not work as intended. Simply copied from the old version.
    for (const value of coords) {
        if (isPolygon) {
            value.forEach(point => {
                transCoords.push(transformPoint(point));
            });
            continue;
        }
        transCoords.push(transformPoint(value));
    }

    return isPolygon ? [transCoords] : transCoords;
}


/**
 * Transforms the given geometry from EPSG:25832 to EPSG:4326.
 * Returns an empty array for unsupported geometry types.
 * @param {module:ol/geom/Geometry} geometry Geometry to be transformed.
 * @returns {(Array<number>|Array<Array<number>>|Array<Array<Array<number>>>)} The transformed geometry or an empty array.
 */
function transformCoordinates (geometry) {
    const coords = geometry.getCoordinates(),
        type = geometry.getType();

    switch (type) {
        case "LineString":
            return transform(coords, false);
        case "Point":
            return transformPoint(coords);
        case "Polygon":
            return transform(coords, true);
        case "MultiPolygon":
            return coords;

        default:
            return [];
    }
}

/**
 * Gets a kml document which has custom attributes from given features added.
 * @param {ol.Feature[]} features The features.
 * @param {Object} format The format of the features.
 * @returns {Document|null} The KML document.
 */
function getKMLWithCustomAttributes (features, format) {
    if (!Array.isArray(features) || !isObject(format) || !features.some(feature => typeof feature.get === "function" && feature.get("attributes"))) {
        return null;
    }
    const kml = new DOMParser().parseFromString(format.writeFeatures(features), "text/xml"),
        placemarks = kml.getElementsByTagName("Placemark");

    if (!placemarks.length) {
        return null;
    }
    features.forEach((feature, idx) => {
        const attributes = feature.get("attributes"),
            attributeKeys = isObject(attributes) ? Object.keys(attributes) : [];

        if (!attributeKeys.length) {
            return;
        }
        attributeKeys.forEach(attrKey => {
            if (placemarks[idx]) {
                const extendedData = placemarks[idx].querySelector("ExtendedData");

                if (!(extendedData instanceof Element)) {
                    return;
                }

                const data = extendedData.querySelector(`Data[name='${attrKey}']`),
                    existingDataNode = extendedData.querySelector(`Data[name='custom-attribute____${attrKey}']`);

                if (existingDataNode instanceof Element) {
                    existingDataNode.remove();
                }

                if (data instanceof Element) {
                    data.setAttribute("name", `custom-attribute____${attrKey}`);
                }
            }
        });
    });
    return kml;
}

/**
 * Converts features to a KML string.
 * @param {ol.Feature[]} features The used features.
 * @param {Object} format Format used to serialize the features.
 * @returns {String} The features converted to KML.
 */
function convertFeatures (features, format) {
    const convertedFeatures = [];
    let kml = null;

    for (const feature of features) {
        const cloned = feature.clone(),
            transCoords = transformCoordinates(cloned.getGeometry());

        if (transCoords.length === 3 && transCoords[2] === 0) {
            transCoords.pop();
        }

        cloned.getGeometry().setCoordinates(transCoords, "XY");
        convertedFeatures.push(cloned);
    }

    kml = getKMLWithCustomAttributes(convertedFeatures, format);
    if (kml === null) {
        return format.writeFeatures(convertedFeatures);
    }
    return new XMLSerializer().serializeToString(kml);
}

/**
 * Converts the features to KML while also saving its style information.
 * @param {ol.Feature[]} features The used features.
 * @returns {String} The features written in KML as a String.
 */
async function convertFeaturesToKml (features) {
    const featureCount = features.length,
        anchors = Array(featureCount).fill(undefined),
        format = new KML({extractStyles: true}),
        hasIconUrl = Array(featureCount).fill(false),
        pointColors = Array(featureCount).fill(undefined),
        pointScales = Array(featureCount).fill(undefined),
        skip = Array(featureCount).fill(false),
        textFontSize = Array(featureCount).fill(undefined),
        convertedFeatures = new DOMParser().parseFromString(convertFeatures(features, format), "text/xml");

    features.forEach((feature, i) => {
        const type = feature.getGeometry().getType(),
            drawState = feature.get("drawState");
        let color,
            style,
            styles;

        if (type === "Point" && drawState && drawState.text !== undefined) {
            // Imported KML with text, can be used as it is
            skip[i] = true;
            textFontSize[i] = drawState.fontSize;
        }
        else {
            try {
                styles = feature.getStyleFunction()(feature);
                style = Array.isArray(styles) ? styles[0] : styles;
            }
            catch (err) {
                // Only happens if an imported KML is exported, can be skipped
                skip[i] = true;
            }

            if (type === "Point" && skip[i] === false && style) {
                if (style.getImage() !== null && style.getImage().iconImage_ !== undefined) {
                    // Imported KML with link to SVG icon, has iconUrl from previous import
                    hasIconUrl[i] = true;
                    const anchorXUnits = style.getImage().anchorXUnits_,
                        anchorYUnits = style.getImage().anchorYUnits_,
                        anchor = style.getImage().anchor_;

                    anchors[i] = {xUnit: anchorXUnits, yUnit: anchorYUnits, anchor: anchor};
                }
                else if (style.getText()) {
                    textFontSize[i] = parseInt(style.getText().getFont(), 10);
                }
                else {
                    color = style.getImage().getFill().getColor();
                    pointColors[i] = [color[0], color[1], color[2]];
                    pointScales[i] = Math.max(...style.getImage().getSize()) / 32;
                }
            }
        }
    });

    Array.from(convertedFeatures.getElementsByTagName("Placemark")).forEach((placemark, i) => {
        if (placemark.getElementsByTagName("Point").length > 0 && skip[i] === false) {
            const style = placemark.getElementsByTagName("Style")[0];

            if (hasIconUrl[i] === false && pointColors[i]) {
                // Please be aware of devtools/tasks/replace.js and devtools/tasks/customBuildPortalconfigsReplace.js if you change the path of the SVG
                const iconUrl = `${window.location.origin}/src/assets/img/tools/draw/circle_${getIconColor(pointColors[i])}.svg`,
                    iconStyle = createKmlIconStyle(iconUrl, pointScales[i]);

                style.innerHTML += iconStyle;
            }
            else if (hasIconUrl[i] === true && anchors[i] !== undefined) {
                const iconStyle = placemark.getElementsByTagName("IconStyle")[0];

                iconStyle.innerHTML += getKmlHotSpotOfIconStyle(anchors[i]);
            }
        }

        // Setting format for text
        if (placemark.getElementsByTagName("Point").length > 0 && skip[i] === true && !isNaN(textFontSize[i])) {
            const scale = textFontSize[i] / 16,
                style = placemark.getElementsByTagName("Style")[0],
                iconUrl = `${window.location.origin}/src/assets/img/tools/draw/circle_blue.svg`,
                maskIcon = new DOMParser().parseFromString("<IconStyle><scale>0</scale><Icon><href>" + iconUrl + "</href></Icon></IconStyle>", "text/xml"),
                maskScale = new DOMParser().parseFromString("<scale>" + scale + "</scale>", "text/xml");

            style.getElementsByTagName("LabelStyle")[0].appendChild(maskScale.getElementsByTagName("scale")[0]);
            style.appendChild(maskIcon.getElementsByTagName("IconStyle")[0]);
        }
    });
    return new XMLSerializer().serializeToString(convertedFeatures);
}

/**
 * Sets the attributes of each feature as requested by the converting function.
 * @param {ol/Feature[]} features An array of features.
 * @returns {ol/Feature[]|Boolean} The features including the necessary attributes. False if the given parameter is not an array.
 */
function setKmlAttributes (features) {
    if (!Array.isArray(features)) {
        return false;
    }

    features.forEach(feature => {
        if (feature instanceof Feature && !Object.prototype.hasOwnProperty.call(feature.getProperties(), "attributes")) {
            feature.set("attributes", {});

            Object.keys(feature.getProperties()).forEach(key => {
                if (!["masterportal_attributes", "geometry", "attributes"].includes(key)) {
                    feature.get("attributes")[key] = feature.get(key);
                }
            });

            if (Object.prototype.hasOwnProperty.call(feature.getProperties(), "masterportal_attributes")) {
                Object.keys(feature.get("masterportal_attributes")).forEach(key => {
                    feature.set(key, feature.get("masterportal_attributes")[key]);
                });
            }
        }
    });

    return features;
}

/**
 * Transforms circle geometries so they can be exported.
 * @param {ol/Feature[]} features The features with geometries to be transformed.
 * @returns {ol/Feature[]} Features with transformed geometries.
 */
function transformGeometries (features) {
    const resultFeatures = [];

    features.forEach(drawnFeature => {
        const feature = drawnFeature.clone(),
            geometry = feature.getGeometry();

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
        resultFeatures.push(feature);
    });

    return resultFeatures;
}

export default {
    convertFeatures,
    convertFeaturesToKml,
    transformCoordinates,
    getKMLWithCustomAttributes,
    setKmlAttributes,
    transformGeometries
};
