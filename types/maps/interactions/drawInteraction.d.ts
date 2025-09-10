declare namespace _default {
    export { convertUnits };
    export { createDrawInteraction };
    export { drawCircle };
    export { drawInnerCircle };
    export { drawOuterCircle };
    export { setStyleObject };
    export { transformMapUnitRadius };
}
export default _default;
export let styleObject: any;
/**
 * Converts a value from one unit to another.
 * @param {Number} value The value to convert.
 * @param {String} sourceUnit The source unit.
 * @param {String} targetUnit The target unit.
 * @returns {Number} The converted value.
 */
declare function convertUnits(value: number, sourceUnit: string, targetUnit: string): number;
/**
 * Create the draw interaction.
 * @param {String} drawType The current draw type.
 * @param {ol/source} source The vector layer source for draw features.
 * @returns {ol/interaction/Draw|null} The draw interaction.
 */
declare function createDrawInteraction(drawType: string, source: any): ol;
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
declare function drawCircle(drawInteraction: any, drawType: string, mapProjection: any, source: any, options?: {
    innerRadius?: number;
    interactive?: boolean;
    outerRadius?: number;
}): void;
/**
 * Create a feature for the (inner) circle of draw type: circle or double circle.
 * @param {ol/feature} feature The ol feature.vb
 * @param {Object} mapProjection The map projection.
 * @param {Object} [options={}] The options for drawing features.
 * @param {Number} [options.innerRadius] The radius for the (inner) circle.
 * @returns {void}
 */
declare function drawInnerCircle(feature: any, mapProjection: any, options?: {
    innerRadius?: number;
}): void;
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
declare function drawOuterCircle(feature: any, mapProjection: any, source: any, options?: {
    innerRadius?: number;
    outerRadius?: number;
}): void;
/**
 * Creates a styleObject from vectorStyling from layout.
 * @param {Object} currentLayout The current layout.
 * @param {Boolean} [outerCircle=false] Indicates if the styling is for the outer circle.
 * @returns {void}
 */
declare function setStyleObject(currentLayout: any, outerCircle?: boolean): void;
/**
 * Transform the radius to map projection unit.
 * @param {Number} radius The radius.
 * @param {Object} mapProjection The map projection.
 * @returns {Number} The transformed radius.
 */
declare function transformMapUnitRadius(radius: number, mapProjection: any): number;
