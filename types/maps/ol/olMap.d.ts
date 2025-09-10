/**
 * Creates an openlayers map according to configuration. Does not set many default values itself, but uses function that do.
 * Check the called functions for default values, or [the defaults file]{@link ./defaults.js}.
 * @param {object} [config] - configuration object - falls back to defaults if none given
 * @param {string} [config.target="map"] - div id to render map to
 * @param {string} [config.namedProjections] - projections to create the map
 * @param {string} [config.backgroundImage] - background image for map; "" to use none
 * @param {string} [config.epsg] - CRS to use
 * @param {number[]} [config.extent] - extent to use
 * @param {Array.<{resolution: number, scale: number, zoomLevel: number}>} [config.options] - zoom level definition
 * @param {Array.<string[]>} [config.options] - each sub-array has two values: projection name, and projection description
 * @param {number} [config.startResolution] - initial resolution
 * @param {number[]} [config.startCenter] - initial position
 * @param {(string|object)} [config.layerConf] - services registry or URL thereof
 * @param {string} [config.gazetteerUrl] - url of gazetteer to use in searchAddress
 * @param {object}  [settings={}] - setings object
 * @param {object} [settings.mapParams] - additional parameter object that is spread into the ol.Map constructor object
 * @param {function} [settings.callback] - optional callback for layer list loading
 * @param {function} [settings.errorCallback] – method called on error events
 * @param {String} [mapMode = "2D"] The map mode. '2D' to craete a 2D-map and '3D' to create a 3D-map.
 * @returns {object} map object from ol
 */
export function createMap(config?: {
    target?: string;
    namedProjections?: string;
    backgroundImage?: string;
    epsg?: string;
    extent?: number[];
    options?: Array<{
        resolution: number;
        scale: number;
        zoomLevel: number;
    }>;
    options?: {
        resolution: number;
        scale: number;
        zoomLevel: number;
    }[];
    startResolution?: number;
    startCenter?: number[];
    layerConf?: (string | object);
    gazetteerUrl?: string;
}, { mapParams, callback, errorCallback }?: {
    mapParams?: object;
    callback?: Function;
    errorCallback?: Function;
}): object;
