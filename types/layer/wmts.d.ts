declare namespace _default {
    export { createLayer };
    export { createLayerSourceByCapabilities };
    export { createLayerSourceByDefinitions };
    export { getWMTSCapabilities };
    export { generateArrays };
    export { showErrorMessage };
}
export default _default;
/**
 * Creates the WMTSLayer.
 * @param {object} rawLayer - layer specification as in services.json
 * @param {object} layerParams - additional layer params
 * @returns {void}
 */
declare function createLayer(rawLayer: object, layerParams?: object): void;
/**
* Creates the LayerSource for this WMTSLayer from the WMTS capabilities.
* @param {Object} attrs  attributes of the layer
* @param {WMTS} tileLayer layer object
* @returns {void}
*/
declare function createLayerSourceByCapabilities(attrs: any, tileLayer: WMTS): void;
/**
* Creates the LayerSource from definitions in the service.json for this WMTSLayer.
* @param {Object} attrs attributes of the layer
* @param {WMTS} tileLayer layer object
* @returns {void}
*/
declare function createLayerSourceByDefinitions(attrs: any, tileLayer: WMTS): void;
/**
 * Gets the WMTS-GetCapabilities document and parse it
 * @param {String} url url for getting capabilities
 * @throws {Error} on unexpected return
 * @returns {promise} promise resolves to parsed WMTS-GetCapabilities object
 */
declare function getWMTSCapabilities(url: string): Promise<any>;
/**
 * Generates resolutions and matrixIds arrays for the WMTS LayerSource.
 * @param {Array} resolutions The resolutions array for the LayerSource.
 * @param {Array} matrixIds The matrixIds array for the LayerSource.
 * @param {Number} length The length of the given arrays.
 * @param {Number} size The tileSize depending on the extent.
 * @returns {void}
 */
declare function generateArrays(resolutions: any[], matrixIds: any[], length: number, size: number): void;
/**
 * Shows error message in console for various WMTS errors.
 * @param {String} errorMessage error message
 * @param {String} layerName layerName
 * @returns {void}
 */
declare function showErrorMessage(errorMessage: string, layerName: string): void;
import WMTS from "ol/source/WMTS";
