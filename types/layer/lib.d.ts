/**
 * @param {ol.Layer} layer - layer to check
 * @param {number} params - parameter object
 * @param {number} [params.resolution] - resolution to check; if not given, map is required
 * @param {object} [params.map] - map to check; if not given, resolution is required
 * @returns {boolean} whether layer is visible in given resolution
 */
export function isLayerVisibleInResolution(layer: ol.Layer, { resolution, map }: number): boolean;
/**
 * Generates an array of URLs that are supposed to hold legend graphics.
 *
 * @param {*} rawLayer - layer specification as in services.json
 * @param {string} [rawLayer.layers=""] - comma separated list of service layers
 * @returns {string[]} URLs of legend graphics for the rawLayer.
 */
export function getLegendURLs({ legendURL, layers, url, typ, format, version }: any): string[];
