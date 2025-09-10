/**
 * @typedef {Object} layerParams
 * @property {string} [renderer] - use default canvas or webgl renderer
 * @property {string} [styleId] - the styleId of the layer
 * @property {string[]} [excludeTypesFromParsing] - types that should not be parsed from strings, only necessary for webgl
 */
/**
 * Creates the VectorSource for a GeoJSON layer. It will ensure each feature has the field id set to use with the other exported geojson functions.
 * @param {object} rawLayer - rawLayer as specified in services.json
 * @param {string} [rawLayer.url] - url to fetch geojson from; if no rawLayer.features given, this is required
 * @param {object} [rawLayer.features] - if features are transmitted via rawLayer, they will be used instead of requesting an URL
 * @param {"default" | "webgl" | undefined} [rawLayer.renderer] - use default canvas or webgl renderer
 * @param {string} [rawLayer.styleId] - the styleId of the layer, only necessary for webgl style pipeline
 * @param {string[]} [rawLayer.excludeTypesFromParsing] - types that should not be parsed from strings, only necessary for webgl
 * @param {string[]} [rawLayer.isPointLayer] - whether the layer consists merely of points (or multi points)
 * @param {object} options - options of the geojson layer
 * @returns {ol.source.Vector} created VectorSource
 */
export function createLayerSource({ url, features, clusterDistance, renderer, styleId, excludeTypesFromParsing, isPointLayer }: {
    url?: string;
    features?: object;
    renderer?: "default" | "webgl" | undefined;
    styleId?: string;
    excludeTypesFromParsing?: string[];
    isPointLayer?: string[];
}, options: object): ol.source.Vector;
/**
 * Creates a layer for GeoJSON.
 * @param {object} rawLayer - rawLayer as specified in services.json
 * @param {object} [layerParams={}] - extra params of the layer
 * @param {object} [options={}] - parameter object
 * @param {ol.Map} [options.map] - map the geojson is to be projected on
 * @param {ol.Style} [options.layerStyle] - optional style; if not given, default styling (modifiable by setCustomStyles) is used
 * @returns {ol.layer.Vector} Layer with id and source specified in rawLayer
 */
export function createLayer(rawLayer?: object, { layerParams, options }?: object): ol.layer.Vector;
/**
 * GeoJSON layer with an URL will be reloaded. All other layers will be refreshed.
 * @param {ol.layer.Vector} layer - GeoJSON layer to update
 * @returns {undefined}
 */
export function updateSource(layer: ol.layer.Vector): undefined;
/**
 * Sets a style to all given features.
 * @param {ol.Feature[]} features - openlayers features to be styled
 * @param {ol.style.Style~StyleLike} featureStyle - style, array of styles, or style function
 * @returns {undefined}
 */
export function setFeatureStyle(features: ol.Feature[], featureStyle: any): undefined;
/**
 * @param {ol.Layer} layer - layer to hide all features of
 * @returns {undefined}
 */
export function hideAllFeatures(layer: ol.Layer): undefined;
/**
 * @param {ol.Layer} layer - layer to show all features of
 * @returns {undefined}
 */
export function showAllFeatures(layer: ol.Layer): undefined;
/**
 * @param {ol.Layer} layer - layer to show some features of
 * @param {string[]} featureIdList - list of feature.id to show
 * @returns {undefined}
 */
export function showFeaturesById(layer: ol.Layer, featureIdList: string[]): undefined;
/**
 * Load the features manually.
 * @param {Object} layerAttributes raw layer attributes.
 * @param {module:ol/vector/Source} layerSource - the source of the layer
 * @returns {void}
 */
export function loadFeaturesManually(layerAttributes: any, layerSource: any): void;
export { setCustomStyles };
export type layerParams = {
    /**
     * - use default canvas or webgl renderer
     */
    renderer?: string;
    /**
     * - the styleId of the layer
     */
    styleId?: string;
    /**
     * - types that should not be parsed from strings, only necessary for webgl
     */
    excludeTypesFromParsing?: string[];
};
import { setCustomStyles } from "./style";
