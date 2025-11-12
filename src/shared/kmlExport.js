/* eslint-disable no-underscore-dangle */
import {KML} from "ol/format.js";
import Feature from "ol/Feature.js";
import {isObject, transformPoint} from "./utils.js";


/**
 * Converts an RGBA color array to a KML hex color string (aabbggrr format).
 *
 * @param {Number[]} rgba The color as [r, g, b, a] where r/g/b are 0-255 and a is 0-1.
 * @returns {String} The KML hex color string in aabbggrr format, or empty string if input is invalid.
 */
function rgbaToKmlColorHex (rgba) {
    if (!Array.isArray(rgba) || rgba.length < 3) {
        return "";
    }
    const r = Math.round(rgba[0]).toString(16).padStart(2, "0"),
        g = Math.round(rgba[1]).toString(16).padStart(2, "0"),
        b = Math.round(rgba[2]).toString(16).padStart(2, "0"),
        a = rgba.length >= 4 ? Math.round(rgba[3] * 255).toString(16).padStart(2, "0") : "ff";

    return `${a}${b}${g}${r}`;
}

/**
 * Creates the IconStyle-Part of a Point-KML. Contains the link to a SVG.
 *
 * @see https://developers.google.com/kml/documentation/kmlreference#iconstyle
 * @param {String} url URL from where the Icon can be retrieved from.
 * @param {Number} scale Scale of the Icon. NOTE: If this value is 0, the Icon is not displayed.
 * @param {String} [color] Optional KML hex color string (aabbggrr format).
 * @returns {String} The IconStyle-Part of a KML-File.
 */
function createKmlIconStyle (url, scale, color) {
    const scaleTag = `<scale>${scale}</scale>`,
        href = `<href>${url}</href>`,
        colorTag = color ? `<color>${color}</color>` : "";

    return `<IconStyle>${colorTag}${scaleTag}<Icon>${href}</Icon></IconStyle>`;
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
 * Transforms the given coordinates from EPSG:25832 to EPSG:4326, regardless of their nesting depth.
 * Handles single coordinates as well as the nested arrays of (multi) lines and (multi) polygons.
 *
 * @param {(Array<number>|Array<Array<number>>|Array<Array<Array<number>>>)} coords Coordinates.
 * @param {String} projectionCode Source projection code (e.g. "EPSG:25832").
 * @returns {(Array<number>|Array<Array<number>>|Array<Array<Array<number>>>)} Transformed coordinates.
 */
function transform (coords, projectionCode) {
    if (!Array.isArray(coords) || coords.length === 0) {
        return [];
    }
    if (Array.isArray(coords[0])) {
        return coords.map(nested => transform(nested, projectionCode));
    }
    return transformPoint(projectionCode, coords);
}


/**
 * Transforms the given geometry from EPSG:25832 to EPSG:4326.
 * If the geometry type is not supported, an empty array is returned.
 *
 * @param {module:ol/geom/Geometry} geometry Geometry to be transformed.
 * @param {String} projectionCode Source projection code (e.g. "EPSG:25832").
 * @returns {(Array<number>|Array<Array<number>>|Array<Array<Array<number>>>)} The transformed coordinates or an empty array.
 */
function transformCoordinates (geometry, projectionCode) {
    const type = geometry.getType();

    if (!["Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon"].includes(type)) {
        console.warn(`Geometry type "${type}" is not supported for transformation.`);
        return [];
    }

    if (!projectionCode) {
        return geometry.getCoordinates();
    }

    return transform(geometry.getCoordinates(), projectionCode);
}

/**
 * Gets a KML document which has custom attributes from given features added.
 *
 * @param {ol/Feature[]} features The features.
 * @param {module:ol/format/KML} format The KML format instance.
 * @returns {Document|null} The KML Document or null if no attributes are present.
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

                // KML native tags like name or description are not written into ExtendedData, so no Data node exists for them.
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
 * Converts features to a KML string, transforming coordinates from EPSG:25832 to EPSG:4326.
 *
 * @param {ol/Feature[]} features The features to be converted.
 * @param {module:ol/format/KML} format The KML format instance.
 * @param {String} projectionCode Source projection code (e.g. "EPSG:25832").
 * @returns {String} The features converted to a KML string.
 */
function convertFeatures (features, format, projectionCode) {
    const convertedFeatures = [];
    let kml = null;

    for (const feature of features) {
        const cloned = feature.clone(),
            transCoords = transformCoordinates(cloned.getGeometry(), projectionCode);

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
 * @param {ol.Feature[]} features - the used features
 * @param {String} projectionCode Source projection code (e.g. "EPSG:25832").
 * @returns {String} The features written in KML as a String.
 */
async function convertFeaturesToKml (features, projectionCode) {
    const featureCount = features.length,
        anchors = Array(featureCount).fill(undefined),
        format = new KML({extractStyles: true}),
        hasIconUrl = Array(featureCount).fill(false),
        pointColors = Array(featureCount).fill(undefined),
        pointScales = Array(featureCount).fill(undefined),
        skip = Array(featureCount).fill(false),
        textFonts = Array(featureCount).fill(undefined),
        textFontSize = Array(featureCount).fill(undefined),
        convertedFeatures = new DOMParser().parseFromString(convertFeatures(features, format, projectionCode), "text/xml");

    features.forEach((feature, i) => {
        const type = feature.getGeometry().getType();
        let color,
            style,
            styles;

        if (type === "Point" && feature.values_.drawState && feature.values_.drawState.text !== undefined) {
            // Imported KML with text, can be used as it is
            skip[i] = true;
            textFontSize[i] = feature.values_.drawState.fontSize;
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

            if (type === "Point") {
                if (style.getImage() !== null && style.getImage().iconImage_ !== undefined) {
                    // Imported KML with link to SVG icon, has iconUrl from previous import
                    hasIconUrl[i] = true;
                    const anchorXUnits = style.getImage().anchorXUnits_,
                        anchorYUnits = style.getImage().anchorYUnits_,
                        anchor = style.getImage().anchor_;

                    anchors[i] = {xUnit: anchorXUnits, yUnit: anchorYUnits, anchor: anchor};
                }
                else if (style.getText()) {
                    textFonts[i] = style.getText().getFont();
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
                const drawStateColor = features[i].values_ && features[i].values_.drawState ? features[i].values_.drawState.color : undefined,
                    kmlColor = drawStateColor ? rgbaToKmlColorHex(drawStateColor) : "",
                    iconUrl = `${window.location.origin}/src/assets/img/tools/draw/circle_white.svg`,
                    iconStyle = createKmlIconStyle(iconUrl, pointScales[i], kmlColor);

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
 *
 * @param {ol/Feature[]} features An array of features.
 * @returns {ol/Feature[]|Boolean} The features incl. the necessary attributes. False if the given parameter is not an array.
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
                    const value = feature.get("masterportal_attributes")[key];

                    feature.set(key, key === "drawState" && isObject(value) ? JSON.stringify(value) : value);
                });
            }
        }
    });

    return features;
}


export default {
    convertFeatures,
    convertFeaturesToKml,
    transformCoordinates,
    getKMLWithCustomAttributes,
    setKmlAttributes
};
