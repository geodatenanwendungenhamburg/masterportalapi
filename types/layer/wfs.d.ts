declare namespace _default {
    export { createLayerSource };
    export { createLayer };
    export { createReceivePossiblePropertiesUrl };
    export { sendTransaction };
    export { receivePossibleProperties };
    export { parseDescribeFeatureTypeResponse };
    export { writeTransactionBody };
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
     * - type of features
     */
    featureType: string;
    /**
     * - the namespace URI used for features
     */
    featureNS: string;
    /**
     * - pixel radius, within this radius, all features are "clustered" into one feature - if available, a cluster source is created.
     */
    clusterDistance: number;
    /**
     * - style function to style the layer if options.style is not set
     */
    style: Function;
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
/**
 * Additional options used to create and load the layer source.
 */
export type options = {
    /**
     * - the loading strategy to use, if not set 'bbox' is used
     */
    loadingStrategy: any;
    /**
     * - version of WFS requests. If not set, '1.1.0' is used.
     */
    version: string;
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
     * -  xml resource as wfs filter, the content of the filter file will be sent to the wfs server as POST request
     */
    wfsFilter: Function;
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
 * Creates an ol/source element for the rawLayer by using a loader.
 * The 'featuresloadend' and 'featuresloaderror' events will be fired by using success and failure callbacks of the loader.
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
 * Creates the Url to get possible properties from.
 *
 * @param {string} url from the WFS-T
 * @param {string} version of the WFS-T
 * @param {string} featureType Name of the FeatureType according to the capabilities document
 * @returns {URL} the created url
 */
declare function createReceivePossiblePropertiesUrl(url: string, version: string, featureType: string): URL;
/**
 * Sends a transaction to the service and returns the feature.
 *
 * @param {string} srsName of the coordinate reference system
 * @param {ol/Feature} feature Feature to by inserted / updated / deleted.
 * @param {string} url of the wfs-t service
 * @param {Object} layer the configured representation of the layer in the Masterportal
 * @param {string} transactionMethod which transaction to perform. Possible values are: "insert"|"delete"|"selectedUpdate"
 * @returns {ol/Feature} the given feature
 * @throws {Error} error if occurs
 */
declare function sendTransaction(srsName: string, feature: any, url: string, layer: any, transactionMethod: string): ol;
/**
 * Requests the possible properties of a feature and further values;
 * for more {@see FeatureProperty}.
 *
 * @param {string} url from the WFS-T
 * @param {string} version of the WFS-T
 * @param {string} featureType Name of the FeatureType according to the capabilities document
 * @param {boolean} isSecured Whether the layer is secured by BasicAuth and should include or omit the credentials prompt
 * @returns {Promise<Array>} If the request is successful, an array of prepared feature properties.
 */
declare function receivePossibleProperties(url: string, version: string, featureType: string, isSecured: boolean): Promise<any[]>;
/**
 * Parses the response of a DescribeFeatureType request
 * and prepares its values for later use as an input value for the user.
 *
 * @param {string} responseData XML response data
 * @param {string} featureType Name of the feature type of the service.
 * @returns {Array} If an <element> with a name of the featureType is present, an array of prepared feature properties; else an empty Array.
 */
declare function parseDescribeFeatureTypeResponse(responseData: string, featureType: string): any[];
/**
 * Writes a wfs transaction including the given feature for given layer
 * inserting, updated or deleting the feature depending on the given selectedInteraction.
 *
 * @param {ol/Feature} feature Feature to be inserted, updated or deleted.
 * @param {Object} transactionOptions Information about the layer to be manipulated.
 * @param {string} transactionMethod Which transaction to perform. Possible values are: "insert"|"delete"|"selectedUpdate"
 * @param {string} srsName EPSG code currently used by the map.
 * @returns {string} WFS Transaction as an XML Node as String.
 */
declare function writeTransactionBody(feature: any, transactionOptions: any, transactionMethod: string, version?: string): string;
/**
 * Load the features manually.
 * @param {Object} layerAttributes raw layer attributes.
 * @param {module:ol/vector/Source} layerSource - the source of the layer
 * @returns {void}
 */
declare function loadFeaturesManually(layerAttributes: any, layerSource: any): void;
