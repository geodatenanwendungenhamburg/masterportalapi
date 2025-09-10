/**
 *  Creates a vector layer with custom renderer.
 * @augments VectorLayer
 * @private
 * @implements {WebGLVectorLayerRenderer}
 * @returns {module:ol/layer/VectorLayer} the LocalWebGLLayer with a custom renderer for WebGL styling
 */
export function createVectorLayerRenderer(): any;
/**
 * Creates a vector tile layer with custom renderer.
 * @augments VectorTile
 * @private
 * @implements {WebGLVectorTileLayerRenderer}
 * @param {Object} attrs - the attributes of the layer
 * @returns {module:ol/layer/VectorTile} the LocalWebGLLayer with a custom renderer for WebGL styling of vectorTile layers.
 */
export function createVectorTileLayerRenderer(attrs: any): any;
/**
 * Parses the vectorStyle from style.json to the feature
 * to reduce processing on runtime.
 * Sets properties with style at feature to use by literalSytle of renderer of VectorLayer.
 * @private
 * @param {module:ol/Feature} feature - the feature to check
 * @param {module:Backbone/Model} [styleObject] - (optional) the style model from StyleList
 * @returns {void}
 */
export function formatFeatureStyles(feature: any, styleObject?: any): void;
/**
 * Layouts the geometry coordinates, removes the Z component
 * @deprecated Will be probably removed in release version
 * @private
 * @param {module:ol/Feature} feature - the feature to format
 * @returns {void}
 */
export function formatFeatureGeometry(feature: any): void;
/**
 * Cleans the data by automatically parsing data provided as strings to the accurate data type
 * @todo Extend to Date types
 * @private
 * @param {module:ol/Feature} feature - the feature to format
 * @param {String[]} [excludeTypes=["boolean"]] - types that should not be parsed from strings
 * @returns {void}
 */
export function formatFeatureData(feature: any, excludeTypes?: string[]): void;
/**
 * feature transformations called after loading - but not for layer of typ VectortTile
 * called by the layer source loader, binds the instance of the layer model
 * should be called on each source refresh
 * @param {module:ol/Feature[]} features - the features loaded by the layer
 * @param {String} styleId - The layer's styleId
 * @param {String[]} excludeTypesFromParsing - types that should not be parsed from strings, only necessary for webgl
 * @param {Boolean} isPointLayer - whether the layer source should consist only of points (or multi points)
 * @returns {void}
 */
export function afterLoading(features: any, styleId: string, excludeTypesFromParsing: string[], isPointLayer: boolean): void;
/**
 * Creates the OL Layer instance, used to rebuild the layer when shown again after layer has been disposed
 * @param {Object} attrs - the attributes of the layer
 * @public
 * @returns {VectorLayer | WebGLVectorLayer} returns the layer instance
 */
export function createLayer(attrs: any): VectorLayer | WebGLVectorLayer;
declare namespace _default {
    export { afterLoading };
    export { createLayer };
    export { createVectorLayerRenderer };
    export { formatFeatureData };
    export { formatFeatureGeometry };
    export { formatFeatureStyles };
}
export default _default;
export type LiteralStyle = {
    "stroke-color"?: string;
    "stroke-width"?: number;
    "fill-color"?: string;
    opacity?: number;
    size?: number;
};
import VectorLayer from "ol/layer/Layer";
import WebGLVectorLayer from "ol/layer/WebGLVector.js";
