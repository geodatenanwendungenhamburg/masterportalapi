/**
 * Creates the url for OAF request.
 * @param {rawLayer} rawLayer layer specification as in services.json
 * @param {object} loadingParams added as params to url
 * @param {number[]} [extent] the current viewport extent
 * @returns {string} the url
 */
export function createUrl(rawLayer: rawLayer, loadingParams: object): string;
declare namespace _default {
    export { createLayer };
    export { createLayerSource };
    export { createUrl };
    export { loadFeaturesManually };
}
export default _default;
/**
 * Layer specification as in services.json.
 */
export type rawLayer = {
    /**
     * - id of the layer
     */
    id: string;
    /**
     * - url to load features from
     */
    url: string;
    /**
     * - name of the oaf collection
     */
    collection: string;
    /**
     * - pixel radius, within this radius, all features are "clustered" into one feature - if available, a cluster source is created.
     */
    clusterDistance: number;
    /**
     * - style function to style the layer if options.style is not set
     */
    style: Function;
};
/**
 * Additional options used to create and load the layer source.
 */
export type options = {
    /**
     * - the loading strategy to use, if not set 'bbox' is used
     */
    loadingStrategy: any;
    /**
     * - function called on loading error, gets parameter error
     */
    onLoadingError: Function;
    /**
     * - function called before loading
     */
    beforeLoading: Function;
    /**
     * - function called after loading, gets parameter features
     */
    afterLoading: Function;
    /**
     * - function called after loading to filter features, gets parameter features
     */
    featuresFilter: Function;
    /**
     * - default false, if set to true the layer will be initialized without network call, an empty array of features is promoted - this is useful to add features later on (e.g. by filtering) to a full functional but initially empty layer
     */
    doNotLoadInitially: Function;
    /**
     * -  used in cluster source. Returns the geometry of the cluster, gets parameter feature
     */
    clusterGeometryFunction: Function;
    /**
     * - style function to style the layer
     */
    style: Function;
    /**
     * - added as params to url
     */
    loadingParams: object;
};
/**
 * Creates complete ol/Layer from rawLayer containing all required children.
 * @param {rawLayer} rawLayer - layer specification as in services.json
 * @param {object} [optionalParams] - optional params
 * @param {object} [optionalParams.layerParams] - additional layer params
 * @param {options} [optionalParams.options] - additional options
 * @returns {ol.Layer} Layer that can be added to map.
 */
declare function createLayer(rawLayer?: rawLayer, { layerParams, options }?: {
    layerParams?: object;
    options?: options;
}): ol.Layer;
/**
 * Creates an ol/source element for the rawLayer by OAF (XML or Geojson)
 * @param {rawLayer} rawLayer layer specification as in services.json
 * @param {"default" | "webgl" | undefined} [rawLayer.renderer] - use default canvas or webgl renderer
 * @param {string} [rawLayer.styleId] - the styleId of the layer, only necessary for webgl style pipeline
 * @param {string[]} [rawLayer.excludeTypesFromParsing] - types that should not be parsed from strings, only necessary for webgl
 * @param {options} [options] additional options
 * {@link https://openlayers.org/en/latest/apidoc/module-ol_source_Vector-VectorSource.html failure/success see}
 * @returns {(ol.source.VectorSource|ol.source.Cluster)} VectorSource or Cluster, depending on whether clusterDistance is set.
 */
declare function createLayerSource(rawLayer: rawLayer, options?: options): (ol.source.VectorSource | ol.source.Cluster);
/**
 * Load the features manually.
 * @param {Object} layerAttributes raw layer attributes.
 * @param {module:ol/vector/Source} layerSource - the source of the layer
 * @returns {void}
 */
declare function loadFeaturesManually(layerAttributes: any, layerSource: any): void;
