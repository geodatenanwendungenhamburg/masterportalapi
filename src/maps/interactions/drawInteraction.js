import {createBox, createRegularPolygon} from "ol/interaction/Draw.js";
import {Circle as CircleStyle, Icon, Style, Fill} from "ol/style.js";
import Text from "ol/style/Text.js";
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
        },
        square: {
            type: "Circle",
            options: {
                geometryFunction: createRegularPolygon(4)
            }
        }
    };
let styleObject = null,
    styleObjectOuterCircle = null,
    zIndex = 0;

/**
 * Returns the current style rule from styleObject.
 * @returns {Object|null} The current style rule or null.
 */
function getCurrentStyleRule () {
    return styleObject?.rules?.[0]?.style || null;
}

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
    let mapUnitRadius = radius;

    if (unit === "degrees") {
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
 * @param {String} [options.unit] The unit for the radii (e.g. "m", "km").
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
 * @param {ol/feature} feature The ol feature.
 * @param {Object} mapProjection The map projection.
 * @param {Object} [options={}] The options for drawing features.
 * @param {Number} [options.innerRadius] The radius for the (inner) circle.
 * @param {String} [options.unit] The unit for the radius (e.g. "m", "km").
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
 * @param {String} [options.unit] The unit for the radii (e.g. "m", "km").
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
        strokeOpacity = fillOpacity,
        fillColorRgba = [...currentLayout.fillColor, fillOpacity],
        strokeColorRgba = [...currentLayout.strokeColor, strokeOpacity],
        style = {
            rules: [
                {
                    style: {
                        circleFillColor: fillColorRgba,
                        circleStrokeColor: currentLayout.strokeColor,
                        circleStrokeWidth: currentLayout.strokeWidth,
                        lineStrokeColor: strokeColorRgba,
                        lineStrokeWidth: currentLayout.strokeWidth,
                        polygonFillColor: fillColorRgba,
                        polygonStrokeColor: currentLayout.strokeColor,
                        polygonStrokeDash: currentLayout.polygonDash,
                        polygonStrokeDashOffset: currentLayout.polygonStrokeDashOffset,
                        polygonStrokeWidth: currentLayout.strokeWidth,
                        text: currentLayout.text || "Text",
                        textFont: currentLayout.font || "Arial",
                        textFontSize: currentLayout.fontSize || 10
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
 * @param {String} wfsImgPath Path to the image folder from Config.
 * @returns {void}
 */
function setStyleToDrawInteraction (drawInteraction, wfsImgPath) {
    drawInteraction.on("drawstart", event => {
        const style = createStyle.createStyle(styleObject, event.feature, false, wfsImgPath);

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
        const style = getCurrentStyleRule();

        event.feature.set("drawType", "writeText");

        if (!style?.text) {
            console.error("Style object for text is not properly initialized.");
            return;
        }

        const textStyle = new Text({
                text: style.text ?? "",
                font: `${style.textFontSize}px ${style.textFont}`,
                fill: new Fill({color: style.polygonFillColor || "black"}),
                textAlign: style.textAlign || "left",
                textBaseline: "bottom"
            }),
            olStyle = new Style({text: textStyle});

        olStyle.setZIndex(zIndex++);
        event.feature.set("textContent", style.text);
        event.feature.set("textFontSize", style.textFontSize);
        event.feature.set("textFont", style.textFont);
        event.feature.set("textFillColor", style.polygonFillColor);
        event.feature.setStyle(olStyle);
    });
}

/**
 * Returns the current text style from the styleObject for use as sketch/preview.
 * @returns {ol/style/Style|null} The text style or null.
 */
function getTextStyle () {
    const style = getCurrentStyleRule();

    if (!style) {
        return null;
    }

    if (!style.text || style.text === "Text") {
        return null;
    }

    return new Style({
        text: new Text({
            text: style.text,
            font: `${style.textFontSize}px ${style.textFont}`,
            fill: new Fill({color: style.polygonFillColor || "black"}),
            textAlign: style.textAlign || "left",
            textBaseline: "bottom"
        })
    });
}

/**
 * Returns a style for simple point features without stroke.
 * Uses the current circleFillColor from the styleObject.
 * @returns {ol/style/Style} The point style.
 */
function getSimplePointStyle () {
    const rawColor = getCurrentStyleRule()?.circleFillColor || [0, 0, 0, 1],
        fillColor = [rawColor[0], rawColor[1], rawColor[2], 1];

    return new Style({
        image: new CircleStyle({
            radius: 8,
            fill: new Fill({color: fillColor})
        })
    });
}

/**
 * Create the draw interaction.
 * @param {String} drawType The current draw type.
 * @param {ol/source} source The vector layer source for draw features.
 * @param {Object[]} [iconList=[]] The list of symbols for the draw type symbols.
 * @param {String} [wfsImgPath=""] Path to the image folder, used as prefix when symbol value is not an absolute path.
 * @returns {ol/interaction/Draw|null} The draw interaction.
 */
function createDrawInteraction (drawType, source, iconList, wfsImgPath = "") {
    let drawInteraction = null;
    const symbol = iconList?.length > 0 ? iconList.find(val => val.id === drawType) : null;

    if (symbol) {
        if (symbol.type === "image") {
            const iconSrc = symbol.value.startsWith("/") || symbol.value.startsWith("http") || symbol.value.startsWith(".")
                    ? symbol.value
                    : `${wfsImgPath}${symbol.value}`,
                svgStyle = new Style({
                    image: new Icon({
                        src: iconSrc,
                        scale: symbol.scale || 1,
                        anchor: [0.5, 1]
                    })
                });

            drawInteraction = new Draw({
                source: source,
                type: "Point",
                style: svgStyle
            });
        }
        else if (symbol.type === "simple_point") {
            drawInteraction = new Draw({
                source: source,
                type: "Point",
                style: getSimplePointStyle
            });
            drawInteraction.on("drawstart", event => {
                const style = getSimplePointStyle();

                style.setZIndex(zIndex++);
                event.feature.setStyle(style);
            });
        }
        else {
            drawInteraction = new Draw({
                source: source,
                type: "Point"
            });
            if (styleObject !== null) {
                setStyleToDrawInteraction(drawInteraction, wfsImgPath);
            }
            drawInteraction.getOverlay().setStyle([]);
        }
    }
    else if (typeof mappingDrawTypes[drawType] === "object") {
        const options = mappingDrawTypes[drawType].options || {};

        drawInteraction = new Draw({
            freehand: options.freehand,
            geometryFunction: options.geometryFunction,
            source: source,
            type: mappingDrawTypes[drawType].type
        });

        if (styleObject !== null && drawType !== "doubleCircle" && drawType !== "writeText") {
            setStyleToDrawInteraction(drawInteraction, wfsImgPath);
        }

        if (drawType === "writeText") {
            setStyleToDrawText(drawInteraction);
            drawInteraction.getOverlay().setStyle(getTextStyle() ?? []);
        }
        else {
            drawInteraction.getOverlay().setStyle([]);
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
    getTextStyle,
    setStyleObject,
    transformMapUnitRadius
};
