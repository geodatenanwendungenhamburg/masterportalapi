/** @returns {number} random session id in range (0, 9999999) */
export function generateSessionId(): number;
/**
 * Adds optional wms parameters to the given parameters.
 * @param {object} params - the mandatory params of wms request url
 * @param {object} rawLayer - layer specification as in services.json
 * @param {boolean} [rawLayer.STYLES] - styles of the layer, if available
 * @param {boolean} [rawLayer.TIME] - time attribute, if available
 * @param {boolean} [rawLayer.CRS] - projection code, if available, else projection of map is used
 * @returns {object} maps query extended parameter names to values
 */
export function addOptionalParams(params: object, rawLayer: {
    STYLES?: boolean;
    TIME?: boolean;
    CRS?: boolean;
}): object;
/**
 * Creates query parameters for webservice requests from rawLayer.
 * @param {object} rawLayer - layer specification as in services.json
 * @param {string} [rawLayer.format="image/png"] - format of images requested
 * @param {string} rawLayer.layers - comma-separated list of requested layers
 * @param {version} rawLayer.version - webservice version as string, e.g. "1.1.1"
 * @param {boolean} rawLayer.transparent - whether tiles from this service should have transparency where no information is available
 * @param {boolean} rawLayer.singleTile - whether only one tile shall be requested that fills the whole view
 * @param {boolean} rawLayer.STYLES - styles of the layer, if available
 * @param {(string|number)} rawLayer.tilesize - if singleTile is true, this is the requested tilesize
 * @param {string} rawLayer.cqlFilter - CQL filter
 * @returns {object} maps query parameter names to values
 */
export function makeParams(rawLayer: {
    format?: string;
    layers: string;
    version: version;
    transparent: boolean;
    singleTile: boolean;
    STYLES: boolean;
    tilesize: (string | number);
    cqlFilter: string;
}): object;
/**
 * Return a ol tile or image load function for the rawLayer.
 * @param {object} rawLayer - layer specification as in services.json
 * @returns {function} tile/image load function
 */
export function defaultLoadFunction({ isSecured }: object): Function;
/**
 * Creates an ol/source element for the rawLayer.
 * @param {object} rawLayer - layer specification as in services.json
 * @param {string} [rawLayer.url] - WMS service URL
 * @param {string} [rawLayer.serverType] - optional servertype definition: "geoserver" or "mapserver" or "qgis"
 * @param {string} [rawLayer.gutter] - optional the size in pixels of the gutter around image tiles to ignore
 * @param {function} [rawLayer.olAttribution] - optional function that takes a module:ol/Map~FrameState and returns a string or an array of strings representing source attributions
 * @param {string|number} [rawLayer.tilesize] - optional needed to create the tileGrid
 * @param {string|"anonymous"} [rawLayer.crossOrigin] - optional needed for CORS requests of image data, to enable canvas export
 * @param {string} [rawLayer.cqlFilter] - optional CQL filter to add to the request
 * @param {boolean} [rawLayer.isSecured] - whether the layer is secured by BasicAuth and should include or omit the credentials prompt
 * @param {object} options - optional resolutions and origin to create the TileGrid
 * @param {Array} [options.resolutions] - optional resolutions to create the TileGrid, must be in descending order
 * @param {Array} [options.origin] - optional origin to create the TileGrid
 * @param {string} [options.crs] - optional projection code, if not available, projection of map is used
 * @returns {(ol.source.TileWMS|ol.source.ImageWMS)} TileWMS or ImageWMS, depending on whether singleTile is true.
 */
export function createLayerSource(rawLayer: {
    url?: string;
    serverType?: string;
    gutter?: string;
    olAttribution?: Function;
    tilesize?: string | number;
    crossOrigin?: string | "anonymous";
    cqlFilter?: string;
    isSecured?: boolean;
}, options: {
    resolutions?: any[];
    origin?: any[];
    crs?: string;
}): (ol.source.TileWMS | ol.source.ImageWMS);
/**
 * Creates complete ol/Layer from rawLayer containing source and all required children.
 * @param {object} rawLayer - layer specification as in services.json
 * @param {string} [rawLayer.id] - optional id of the layer, passed to help identification in services.json
 * @param {string} [rawLayer.url] - WMS service URL
 * @param {string} [rawLayer.minResolution] - optional the minimal resolution
 * @param {string} [rawLayer.maxResolution] - optional the maximal resolution
 * @param {string} [rawLayer.serverType] - optional servertype definition: "geoserver" or "mapserver" or "qgis"
 * @param {string} [rawLayer.gutter] - optional the size in pixels of the gutter around image tiles to ignore
 * @param {function} [rawLayer.olAttribution] - optional function that takes a module:ol/Map~FrameState and returns a string or an array of strings representing source attributions
 * @param {string|number} [rawLayer.tilesize] - optional needed to create the tileGrid
 * @param {string|"anonymous"} [rawLayer.crossOrigin] - optional needed for CORS requests of image data, to enable canvas export
 * @param {object} [optionalParams] - optional params
 * @param {object} [optionalParams.layerParams] - additional layer params
 * @param {options} [optionalParams.options] - additional options
 * @param {object} options - optional resolutions and origin to create the TileGrid
 * @param {Array} [options.resolutions] - optional resolutions to create the TileGrid, must be in descending order
 * @param {Array} [options.origin] - optional origin to create the TileGrid
 * @returns {ol.Layer} Layer that can be added to map.
 */
export function createLayer(rawLayer?: {
    id?: string;
    url?: string;
    minResolution?: string;
    maxResolution?: string;
    serverType?: string;
    gutter?: string;
    olAttribution?: Function;
    tilesize?: string | number;
    crossOrigin?: string | "anonymous";
}, { layerParams, options }?: {
    layerParams?: object;
    options?: any;
}): ol.Layer;
/**
 * Forces an update by giving a layer a new sessionID.
 * @param {ol.Layer} layer - the layer that is to be updated
 * @returns {number} the new sessionID
 */
export function updateSource(layer: ol.Layer): number;
/**
 * Creates the gfiURL from clicked layer, map, and coordinate.
 * @param {ol.Layer} layer - what to get the gfiURL for
 * @param {ol.Map} map - needed for resolution/projection
 * @param {ol.coordinate} coordinate - which point to get the gfiURL for
 * @returns {(string|undefined)} the gfiURL, or undefined if it could not be constructed
 */
export function getGfiURL(layer: ol.Layer, map: ol.Map, coordinate: ol.coordinate): (string | undefined);
