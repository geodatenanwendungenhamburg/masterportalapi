import {createBox} from "ol/interaction/Draw.js";
import {Draw} from "ol/interaction.js";

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
        }
    };

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
 * @param {ol/interaction/Draw} drawInteraction The draw interaction.
 * @param {Object} mapProjection The map projection.
 * @param {ol/source} source The vector layer source for draw features.
 * @param {Object} [options={}] The options for drawing features.
 * @param {Number} [options.circleOuterRadius] The radius for the outer circle.
 * @returns {void}
 */
function drawOuterCircle (drawInteraction, mapProjection, source, options = {}) {
    drawInteraction.on("drawend", event => {
        const outerCircleFeature = event.feature.clone(),
            mapUnitOuterRadius = transformMapUnitRadius(options.circleOuterRadius, mapProjection);

        outerCircleFeature.getGeometry().setRadius(mapUnitOuterRadius);
        source.addFeature(outerCircleFeature);
    });
}

/**
 * Create features for non-interactive circle or double circle.
 * @param {ol/interaction/Draw} drawInteraction The draw interaction.
 * @param {String} drawType The current draw type.
 * @param {Object} mapProjection The map projection.
 * @param {ol/source} source The vector layer source for draw features.
 * @param {Object} [options={}] The options for drawing features.
 * @param {Number} [options.circleInnerRadius] The radius for the inner circle.
 * @param {Number} [options.circleOuterRadius] The radius for the outer circle.
 * @param {Boolean} [options.interactiveCircle] Circle is drawn interactively or not.
 * @returns {void}
 */
function drawCircle (drawInteraction, drawType, mapProjection, source, options = {}) {
    if (options.interactiveCircle === false && options.circleInnerRadius > 0) {
        drawInteraction.on("drawstart", event => {
            const mapUnitInnerRadius = transformMapUnitRadius(options.circleInnerRadius, mapProjection);

            event.feature.getGeometry().setRadius(mapUnitInnerRadius);
            drawInteraction.finishDrawing();
        });

        if (drawType === "doubleCircle" && options.circleOuterRadius > 0) {
            drawOuterCircle(drawInteraction, mapProjection, source, options);
        }
    }
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
            source: source,
            type: mappingDrawTypes[drawType].type,
            freehand: options.freehand,
            geometryFunction: options.geometryFunction
        });
    }

    return drawInteraction;
}

export default {
    createDrawInteraction,
    drawCircle,
    drawOuterCircle,
    transformMapUnitRadius
};
