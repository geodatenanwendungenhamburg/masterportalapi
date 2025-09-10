/**
 * Used properites of layer specification as in services.json.
 *
 * @typedef {Object} rawLayer
 * @property {string} id - Layer id
 * @property {string} name - Layer name
 * @property {string} url - source url
 * @property {string} [epsg=defaults.epsg] - vector tiles crs
 * @property {number[]} [extent] - extent
 * @property {number} [maxZoom=22] - min zoom level
 * @property {number} [minZoom] - max zoom level
 * @property {function} [olAttribution] - optional function that takes a module:ol/Map~FrameState and returns a string or an array of strings representing source attributions
 * @property {number[]} [origin] - The tile grid origin, i.e. where the x and y axes meet ([z, 0, 0]). Tile coordinates increase left to right and downwards
 * @property {number[][]} [origins] - Tile grid origins, i.e. where the x and y axes meet ([z, 0, 0]), for each zoom level. If given, the array length should match the length of the resolutions array, i.e. each resolution can have a different origin. Tile coordinates increase left to right and downwards. If not specified, extent or origin must be provided.
 * @property {number[]} [resolutions] - Resolutions. The array index of each resolution needs to match the zoom level. This means that even if a minZoom is configured, the resolutions array will have a length of maxZoom + 1.
 * @property {number} [tileSize=512] - size of a tile in px
 * @property {number} [zDirection=1] - zoom level offset for requested tiles
 */
/**
 * Used properites of layer specification as in services.json.
 *
 * @typedef {Object} tileGridProperties
 * @property {string} [epsg] - vector tiles crs
 * @property {number} [tileSize=512] - size of a tile in px
 * @property {number} [zDirection=1] - zoom level offset for requested tiles
 * @property {number} [minZoom] - min zoom level
 * @property {number} [maxZoom=22] - may zoom level
 * @property {number[]} [extent] - extent
 * @property {number[]} [resolutions] - Resolutions. The array index of each resolution needs to match the zoom level. This means that even if a minZoom is configured, the resolutions array will have a length of maxZoom + 1.
 * @property {number[]} [origin] - The tile grid origin, i.e. where the x and y axes meet ([z, 0, 0]). Tile coordinates increase left to right and downwards
 * @property {number[][]} [origins] - Tile grid origins, i.e. where the x and y axes meet ([z, 0, 0]), for each zoom level. If given, the array length should match the length of the resolutions array, i.e. each resolution can have a different origin. Tile coordinates increase left to right and downwards. If not specified, extent or origin must be provided.
 */
/**
 * Additional properties for style specification
 * @typedef {Object} styleParams
 * @property {string} [sourceId] - key from the Mapbox Style object. When a source key is provided, all layers for the specified source will be included in the style function.
 * @property {number[]} [resolutions] - Resolutions for mapping resolution to zoom level.
 * @property {object} [spriteData] - Sprite data from the url specified in the Mapbox Style object's sprite property. Only required if a sprite property is specified in the Mapbox Style object.
 * @property {string} [spriteImageUrl] - Url to sprite image
 * @property {function} [getFonts] - Function that receives a font stack as arguments, and returns a (modified) font stack that is available. Font names are the names used in the Mapbox Style object. If not provided, the font stack will be used as-is. This function can also be used for loading web fonts.
 */
/**
 * Create a TileGrid.
 *
 * @param {tileGridProperties} [options] - options
 * @returns {ol.tilegrid.TileGrid} TileGrid
 */
export function createTileGrid(options?: tileGridProperties): ol.tilegrid.TileGrid;
/**
 * Creates a Vector Tiles source.
 *
 * @param {string} url - url to vector tile service
 * @param {tileGridProperties} [options] - properties for tileGrid
 * @param {"default" | "webgl" | undefined} [options.renderer] - use default canvas or webgl renderer
 * @param {string} [options.styleId] - the styleId of the layer, only necessary for webgl style pipeline
 * @param {string[]} [options.excludeTypesFromParsing] - types that should not be parsed from strings, only necessary for webgl
 * @returns {ol.source.VectorTile} Source
 */
export function createLayerSource(url: string, options?: tileGridProperties): ol.source.VectorTile;
/**
 * Creates a Vector Tiles layer.
 *
 * @param {rawLayer} rawLayer - rawLayer as specified in services.json
 * @param {object} [layerParams={}] - extra params of the layer. Can overwrite or extend all ol layer parameters.
 * @param {object} [options={}] - parameter object. Not used atm.
 * @returns {ol.layer.VectorTile} Layer with id and source specified in rawLayer
 */
export function createLayer(rawLayer?: rawLayer, { layerParams, options }?: object): ol.layer.VectorTile;
/**
 * Set a mapbox style
 * @param {ol.layer.VectorTile} layer - layer to style
 * @param {object} glStyle - MapBox style definition
 * @param {options} [styleParams={}] - Additional options for style specification
 * @param {string} url - MapBox style url
 * @returns {void}
 */
export function setStyle(layer: ol.layer.VectorTile, glStyle: object, { options }?: any, url: string): void;
/**
 * Used properites of layer specification as in services.json.
 */
export type rawLayer = {
    /**
     * - Layer id
     */
    id: string;
    /**
     * - Layer name
     */
    name: string;
    /**
     * - source url
     */
    url: string;
    /**
     * - vector tiles crs
     */
    epsg?: string;
    /**
     * - extent
     */
    extent?: number[];
    /**
     * - min zoom level
     */
    maxZoom?: number;
    /**
     * - max zoom level
     */
    minZoom?: number;
    /**
     * - optional function that takes a module:ol/Map~FrameState and returns a string or an array of strings representing source attributions
     */
    olAttribution?: Function;
    /**
     * - The tile grid origin, i.e. where the x and y axes meet ([z, 0, 0]). Tile coordinates increase left to right and downwards
     */
    origin?: number[];
    /**
     * - Tile grid origins, i.e. where the x and y axes meet ([z, 0, 0]), for each zoom level. If given, the array length should match the length of the resolutions array, i.e. each resolution can have a different origin. Tile coordinates increase left to right and downwards. If not specified, extent or origin must be provided.
     */
    origins?: number[][];
    /**
     * - Resolutions. The array index of each resolution needs to match the zoom level. This means that even if a minZoom is configured, the resolutions array will have a length of maxZoom + 1.
     */
    resolutions?: number[];
    /**
     * - size of a tile in px
     */
    tileSize?: number;
    /**
     * - zoom level offset for requested tiles
     */
    zDirection?: number;
};
/**
 * Used properites of layer specification as in services.json.
 */
export type tileGridProperties = {
    /**
     * - vector tiles crs
     */
    epsg?: string;
    /**
     * - size of a tile in px
     */
    tileSize?: number;
    /**
     * - zoom level offset for requested tiles
     */
    zDirection?: number;
    /**
     * - min zoom level
     */
    minZoom?: number;
    /**
     * - may zoom level
     */
    maxZoom?: number;
    /**
     * - extent
     */
    extent?: number[];
    /**
     * - Resolutions. The array index of each resolution needs to match the zoom level. This means that even if a minZoom is configured, the resolutions array will have a length of maxZoom + 1.
     */
    resolutions?: number[];
    /**
     * - The tile grid origin, i.e. where the x and y axes meet ([z, 0, 0]). Tile coordinates increase left to right and downwards
     */
    origin?: number[];
    /**
     * - Tile grid origins, i.e. where the x and y axes meet ([z, 0, 0]), for each zoom level. If given, the array length should match the length of the resolutions array, i.e. each resolution can have a different origin. Tile coordinates increase left to right and downwards. If not specified, extent or origin must be provided.
     */
    origins?: number[][];
};
/**
 * Additional properties for style specification
 */
export type styleParams = {
    /**
     * - key from the Mapbox Style object. When a source key is provided, all layers for the specified source will be included in the style function.
     */
    sourceId?: string;
    /**
     * - Resolutions for mapping resolution to zoom level.
     */
    resolutions?: number[];
    /**
     * - Sprite data from the url specified in the Mapbox Style object's sprite property. Only required if a sprite property is specified in the Mapbox Style object.
     */
    spriteData?: object;
    /**
     * - Url to sprite image
     */
    spriteImageUrl?: string;
    /**
     * - Function that receives a font stack as arguments, and returns a (modified) font stack that is available. Font names are the names used in the Mapbox Style object. If not provided, the font stack will be used as-is. This function can also be used for loading web fonts.
     */
    getFonts?: Function;
};
