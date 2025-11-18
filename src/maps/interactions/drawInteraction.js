import {createBox} from "ol/interaction/Draw.js";
import {Draw} from "ol/interaction.js";

import createStyle from "../../vectorStyle/createStyle";

const earthRadius = 6378137,
    roh = 180 / Math.PI,
    mappingDrawTypes = {
        box: {
            type: "Circle",
            options: {
                geometryFunction: createBox()
            }
        },
        circle: {
            type: "Circle"
        },
        doubleCircle: {
            type: "Circle"
        },
        line: {
            type: "LineString"
        },
        pen: {
            type: "LineString",
            options: {
                freehand: true
            }
        },
        point: {
            type: "Point"
        },
        polygon: {
            type: "Polygon"
        },
        writeText: {
            type: "Point"
        }
    };
let styleObject = null,
    styleObjectOuterCircle = null,
    zIndex = 0;

/**
 * Converts a value from one unit to another.
 * @param {Number} value The value to convert.
 * @param {String} sourceUnit The source unit.
 * @param {String} targetUnit The target unit.
 * @returns {Number} The converted value.
 */
function convertUnits (value, sourceUnit, targetUnit) {
    if (sourceUnit === targetUnit) {
        return value;
    }
    else if (sourceUnit === "m" && targetUnit === "km") {
        return value / 1000;
    }
    else if (sourceUnit === "km" && targetUnit === "m") {
        return value * 1000;
    }
    return value;
}

/**
 * Transform the radius to map projection unit.
 * @param {Number} radius The radius.
 * @param {Object} mapProjection The map projection.
 * @returns {Number} The transformed radius.
 */
function transformMapUnitRadius (radius, mapProjection) {
    const unit = mapProjection.getUnits();
    let mapUnitRadius;

    if (unit === "m") {
        mapUnitRadius = radius;
    }
    else if (unit === "degrees") {
        mapUnitRadius = radius * roh / earthRadius;
    }

    return mapUnitRadius;
}

/**
 * Create a feature for the outer circle of draw type: double circle.
 * @param {ol/feature} feature The ol feature.
 * @param {Object} mapProjection The map projection.
 * @param {ol/source} source The vector layer source for draw features.
 * @param {Object} [options={}] The options for drawing features.
 * @param {Number} [options.innerRadius] The radius for the inner circle.
 * @param {Number} [options.outerRadius] The radius for the outer circle.
 * @returns {void}
 */
function drawOuterCircle (feature, mapProjection, source, options = {}) {
    const innerCircleFeature = feature.clone(),
        innerRadius = convertUnits(options.innerRadius, options.unit, "m"),
        outerRadius = convertUnits(options.outerRadius, options.unit, "m"),
        mapUnitInnerRadius = transformMapUnitRadius(innerRadius, mapProjection),
        mapUnitOuterRadius = transformMapUnitRadius(outerRadius, mapProjection),
        innerStyle = createStyle.createStyle(styleObject, innerCircleFeature, false),
        outerStyle = createStyle.createStyle(styleObjectOuterCircle, feature, false);

    outerStyle.setZIndex(zIndex++);
    feature.setStyle(outerStyle);
    feature.getGeometry().setRadius(mapUnitOuterRadius);

    innerStyle.setZIndex(zIndex++);
    innerCircleFeature.setStyle(innerStyle);
    innerCircleFeature.getGeometry().setRadius(mapUnitInnerRadius);

    source.addFeature(innerCircleFeature);
}

/**
 * Create a feature for the (inner) circle of draw type: circle or double circle.
 * @param {ol/feature} feature The ol feature.vb
 * @param {Object} mapProjection The map projection.
 * @param {Object} [options={}] The options for drawing features.
 * @param {Number} [options.innerRadius] The radius for the (inner) circle.
 * @returns {void}
 */
function drawInnerCircle (feature, mapProjection, options = {}) {
    const innerRadius = convertUnits(options.innerRadius, options.unit, "m"),
        mapUnitInnerRadius = transformMapUnitRadius(innerRadius, mapProjection);

    feature.getGeometry().setRadius(mapUnitInnerRadius);
}

/**
 * Create features for non-interactive circle or double circle.
 * @param {ol/interaction/Draw} drawInteraction The draw interaction.
 * @param {String} drawType The current draw type.
 * @param {Object} mapProjection The map projection.
 * @param {ol/source} source The vector layer source for draw features.
 * @param {Object} [options={}] The options for drawing features.
 * @param {Number} [options.innerRadius] The radius for the inner circle.
 * @param {Boolean} [options.interactive] Circle is drawn interactively or not.
 * @param {Number} [options.outerRadius] The radius for the outer circle.
 * @returns {void}
 */
function drawCircle (drawInteraction, drawType, mapProjection, source, options = {}) {
    if ((drawType === "doubleCircle" || options.interactive === false) && options.innerRadius > 0) {
        drawInteraction.on("drawstart", event => {
            if (drawType === "circle") {
                drawInnerCircle(event.feature, mapProjection, options);
            }
            else if (drawType === "doubleCircle" && options.outerRadius > 0) {
                drawOuterCircle(event.feature, mapProjection, source, options);
            }
            drawInteraction.finishDrawing();
        });
    }
}

/**
 * Creates a styleObject from vectorStyling from layout.
 * @param {Object} currentLayout The current layout.
 * @param {Boolean} [outerCircle=false] Indicates if the styling is for the outer circle.
 * @returns {void}
 */
function setStyleObject (currentLayout, outerCircle = false) {
    const fillOpacity = 1 - (currentLayout.fillTransparency / 100),
        fillColorRgba = [...currentLayout.fillColor, fillOpacity],
        style = {
            rules: [
                {
                    style: {
                        circleFillColor: fillColorRgba,
                        circleStrokeColor: currentLayout.strokeColor,
                        circleStrokeWidth: currentLayout.strokeWidth,
                        lineStrokeColor: currentLayout.strokeColor,
                        lineStrokeWidth: currentLayout.strokeWidth,
                        polygonFillColor: fillColorRgba,
                        polygonStrokeColor: currentLayout.strokeColor,
                        polygonStrokeDash: currentLayout.polygonDash,
                        polygonStrokeDashOffset: currentLayout.polygonStrokeDashOffset,
                        polygonStrokeWidth: currentLayout.strokeWidth,
                        text: currentLayout.text,
                        textFont: currentLayout.font,
                        textFontSize: currentLayout.fontSize
                    }
                }
            ]
        };

    if (outerCircle === true) {
        styleObjectOuterCircle = style;
    }
    else {
        styleObject = style;
    }
}

/**
 * Sets the style to overlay and feature.
 * @param {ol/interaction/Draw} drawInteraction The draw interaction.
 * @returns {void}
 */
function setStyleToDrawInteraction (drawInteraction) {
    drawInteraction.on("drawstart", event => {
        const style = createStyle.createStyle(styleObject, event.feature, false);

        style.setZIndex(zIndex++);
        drawInteraction.getOverlay().setStyle(style);
        event.feature.setStyle(style);
    });
}

/**
 * Sets the style to the text.
 * @param {ol/interaction/Draw} drawInteraction The draw interaction.
 * @returns {void}
 */
function setStyleToDrawText (drawInteraction) {
    drawInteraction.on("drawstart", event => {
        event.feature.set("drawType", "writeText");
        const style = createStyle.createStyle(styleObject, event.feature, false);

        style.setZIndex(zIndex++);
        drawInteraction.getOverlay().setStyle(style);
        event.feature.setStyle(style);
    });
}

/**
 * Create the draw interaction.
 * @param {String} drawType The current draw type.
 * @param {ol/source} source The vector layer source for draw features.
 * @returns {ol/interaction/Draw|null} The draw interaction.
 */
function createDrawInteraction (drawType, source) {
    let drawInteraction = null;

    if (typeof mappingDrawTypes[drawType] === "object") {
        const options = mappingDrawTypes[drawType].options || {};

        drawInteraction = new Draw({
            freehand: options.freehand,
            geometryFunction: options.geometryFunction,
            source: source,
            type: mappingDrawTypes[drawType].type
        });

        if (styleObject !== null && drawType !== "doubleCircle" && drawType !== "writeText") {
            setStyleToDrawInteraction(drawInteraction);
        }

        if (drawType === "writeText") {
            setStyleToDrawText(drawInteraction);
        }
    }

    return drawInteraction;
}

export {styleObject};

export default {
    convertUnits,
    createDrawInteraction,
    drawCircle,
    drawInnerCircle,
    drawOuterCircle,
    setStyleObject,
    transformMapUnitRadius
};
