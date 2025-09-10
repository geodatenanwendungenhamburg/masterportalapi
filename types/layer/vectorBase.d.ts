/**
 * Triggered by Layer to create a layerSource
 * @param {Object} attrs  attributes of the layer
 * @returns {void}
 */
export function createLayerSource(attrs: any): void;
/**
 * updates the source
 * @param {module:ol/layer/Base~BaseLayer} layer The vector base layer that is to be updated.
 * @param {module:ol/Feature~Feature[]} features The ol features.
 * @returns {void}
 */
export function updateSource(layer: any, features: any): void;
/**
 * creates an vector Base
 * @param {Object} attrs  attributes of the layer
 * @returns {Object} layer
 */
export function createLayer(attrs: any): any;
