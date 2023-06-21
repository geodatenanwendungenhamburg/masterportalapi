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
 * Create a draw interaction.
 * @param {ol/source} source The vector layer source for draw features.
 * @param {String} type The geometry type
 * @param {Object} [drawTypeOptions={}] The options for draw interaction
 * @param {Boolean} [drawTypeOptions.freehand] Geometry is drawn freehand.
 * @param {Function} [drawTypeOptions.geometryFunction] Extended geometry function.
 * @returns {ol/interaction/Draw} The draw interaction.
 */
function createDrawInteraction (source, type, drawTypeOptions = {}) {
    return new Draw({
        source: source,
        type: type,
        freehand: drawTypeOptions.freehand,
        geometryFunction: drawTypeOptions.geometryFunction
    });
}

/**
 * Create the draw interaction for interactive or static geometries.
 * @param {String} drawType The current draw type.
 * @param {ol/source} source The vector layer source for draw features.
 * @param {Object} mapProjection The map projection.
 * @param {Object} [options={}] The options for drawing features.
 * @param {Number} [options.circleInnerRadius] The radius for the inner circle.
 * @param {Number} [options.circleOuterRadius] The radius for the outer circle.
 * @param {Boolean} [options.interactiveCircle] Circle is drawn interactively or not.
 * @returns {ol/interaction/Draw|null} The draw interaction.
 */
function createInteractiveOrStaticDrawInteraction (drawType, source, mapProjection, options = {}) {
    let drawInteraction = null;

    if (typeof mappingDrawTypes[drawType] === "object") {
        drawInteraction = createDrawInteraction(source, mappingDrawTypes[drawType].type, mappingDrawTypes[drawType].options);

        if (drawType === "circle" || drawType === "doubleCircle") {
            drawCircle(drawInteraction, drawType, mapProjection, source, options);
        }
    }

    return drawInteraction;
}

export default {
    createInteractiveOrStaticDrawInteraction,
    createDrawInteraction,
    drawCircle,
    drawOuterCircle,
    transformMapUnitRadius
};
