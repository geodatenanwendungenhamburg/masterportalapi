/**
 * Checks the version of the wfs against allowed versions and returns the version.
 * If the version is not allowed, 1.1.0 is returned.
 * @param {rawLayer} rawLayer layer specification as in services.json
 * @param {options} [options] additional options
 * @returns {String} The allowed version.
 */
export function getVersion(rawLayer: any, options?: any): string;
/**
 * Logs and throws an Error.
 * @param {string} error error message
 * @param {object} [options] additional options
 * @param {function} [options.onLoadingError] additional option, called with param error
 * @param {function} failure failure callback to ol.VectorLayer, fires 'featuresloaderror' event
 * {@link https://openlayers.org/en/latest/apidoc/module-ol_source_Vector-VectorSource.html failure: see}
 * @returns {void}
 */
export function onError(error: string, options?: {
    onLoadingError?: Function;
}, failure: Function): void;
/**
 * Called after features are loaded. Calls options.featuresFilter, success-callback and options.afterLoading.
 * Features are added to source.
 * @param {ol.source.VectorSource} source the vector source
 * @param {Array.<module:ol/Feature~Feature>} features loaded features
 * @param {function} onErrorFn  Calls options.onLoadingError and 'featuresloaderror' event will be fired by using failure callback.
 * @param {function} success  callback: 'featuresloadend' event will be fired
 * @param {function} failure failure callback to ol.VectorLayer, fires 'featuresloaderror' event
 * @param {options} [options] additional options
 * @returns {void}
 */
export function onLoad(source: ol.source.VectorSource, features: any, onErrorFn: Function, success: Function, failure: Function, options?: any): void;
