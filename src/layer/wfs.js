import VectorLayer from "ol/layer/Vector.js";
import {bbox} from "ol/loadingstrategy.js";
import {WFS} from "ol/format.js";
import * as webgl from "../renderer/webgl";

import {createVectorSource, createClusterVectorSource} from "./vector";
import {getVersion, onError, onLoad} from "../lib/wfsUtil";

/**
 * Layer specification as in services.json.
 * @typedef {Object} rawLayer
 * @property {string} id - id of the layer
 * @property {string} url - url to load features from
 * @property {string} featureType - type of features
 * @property {string} featureNS - the namespace URI used for features
 * @property {number} clusterDistance - pixel radius, within this radius, all features are "clustered" into one feature - if available, a cluster source is created.
 * @property {function} style - style function to style the layer if options.style is not set
 * @property {string} [renderer] - use default canvas or webgl renderer
 * @property {string} [styleId] - the styleId of the layer
 * @property {string[]} [excludeTypesFromParsing] - types that should not be parsed from strings, only necessary for webgl
 */

/**
 * Additional options used to create and load the layer source.
 * @typedef {Object} options
 * @property {module:ol.source.Vector~LoadingStrategy} loadingStrategy - the loading strategy to use, if not set 'bbox' is used
 * @property {string} version - version of WFS requests. If not set, '1.1.0' is used.
 * @property {function} onLoadingError - function called on loading error, gets parameter error
 * @property {function} beforeLoading - function called before loading
 * @property {function} afterLoading - function called after loading, gets parameter features
 * @property {function} featuresFilter - function called after loading to filter features, gets parameter features
 * @property {function} wfsFilter -  xml resource as wfs filter, the content of the filter file will be sent to the wfs server as POST request
 * @property {function} doNotLoadInitially - default false, if set to true the layer will be initialized without network call, an empty array of features is promoted - this is useful to add features later on (e.g. by filtering) to a full functional but initially empty layer
 * @property {function} clusterGeometryFunction -  used in cluster source. Returns the geometry of the cluster, gets parameter feature
 * @property {function} style - style function to style the layer
 * @property {object} loadingParams - added as params to url
 */

/**
  * @param {object} response of the request
  * @param {function} onErrorFn Calls options.onLoadingError and 'featuresloaderror' event will be fired by using failure callback.
  * @param {options} [options] additional options
  * @param {function} failure failure callback to ol.VectorLayer, fires 'featuresloaderror' event
  * @returns {function | object} Returns the 'onError' function if response is not ok, otherwise the response object.
  */
function handleErrors (response, onErrorFn, options, failure) {
    if (!response.ok) {
        return onErrorFn(`Request to wfs-filter failed. Response status is ${response.status}`, options, failure);
    }
    return response;
}

/**
 * Returns the parameters for the wfs filter request.
 * @param {object} payload to set as body
 * @returns {object} the parameters for the wfs filter request
 */
function getFilterRequestParams (payload) {
    return {
        method: "POST",
        headers: {
            "Content-Type": "text/xml"
        },
        body: payload
    };
}
/**
 * Loads the WFS.
 * Filters the features after load, if options.featuresFilter is given.
 * Adds the features to the source.
 * Errors are thrown through onErrorFn or if a network issue occurs.
 *
 * @param {string} url url to load features from
 * @param {object} params extra loading parameters
 * @param {ol.source.VectorSource} source the vector source
 * @param {object} errorAndSuccessFns functions to handle error and success
 * @param {function} errorAndSuccessFns.onErrorFn  Calls options.onLoadingError and 'featuresloaderror' event will be fired by using failure callback.
 * @param {function} errorAndSuccessFns.success  callback: 'featuresloadend' event will be fired
 * @param {function} errorAndSuccessFns.failure failure callback to ol.VectorLayer, fires 'featuresloaderror' event
 * @param {options} [options] optional additional options
 * @returns {void}
 */
function loadWFS (url, params, source, {onErrorFn, success, failure}, options) {
    fetch(url, params)
        .then((response) => handleErrors(response, onErrorFn, options, failure))
        .then((response) => response.text())
        .then(responseString => source.getFormat().readFeatures(responseString))
        .then(features => onLoad(source, features, onErrorFn, success, failure, options))
        .catch((error) => {
            console.error(error);
        });
}
/**
 * Loads the WFS filter. The content of the filter file will be sent to the wfs server as POST request.
 * Filters the features after load, if options.featuresFilter is given.
 * Adds the features to the source.
 * Errors are thrown through onErrorFn or if a network issue occurs.
 *
 * @param {string} filter xml resource as wfs filter
 * @param {string} url url to load features from
 * @param {ol.source.VectorSource} source the vector source
 * @param {object} errorAndSuccessFns functions to handle error and success
 * @param {function} errorAndSuccessFns.onErrorFn  Calls options.onLoadingError and 'featuresloaderror' event will be fired by using failure callback.
 * @param {function} errorAndSuccessFns.success  callback: 'featuresloadend' event will be fired
 * @param {function} errorAndSuccessFns.failure failure callback to ol.VectorLayer, fires 'featuresloaderror' event
 * @param {options} [options] optional additional options
 * @returns {void}
 */
function loadWFSFilter (filter, url, source, {onErrorFn, success, failure}, options) {
    fetch(filter)
        .then((response) => handleErrors(response, onErrorFn, options, failure))
        .then((response) => response.text())
        .then((payload) => loadWFS(url, getFilterRequestParams(payload), source, {onErrorFn, success, failure}, options))
        .catch((error) => {
            console.error(error);
        });
}

/**
 * Creates the url for request wfs.
 * A distinction is made between the wfs versions.
 * @param {rawLayer} rawLayer layer specification as in services.json
 * @param {String} version version of wfs
 * @param {String} projection projection of wfs
 * @param {String} bboxParam bbox loading strategy
 * @returns {string} the url
 */
function createUrl (rawLayer, version, projection, bboxParam) {
    const url = new URL(rawLayer.url);

    url.searchParams.set("service", "WFS");
    url.searchParams.set("version", version);
    url.searchParams.set("request", "GetFeature");
    url.searchParams.set("srsName", projection.getCode());

    if (version === "1.0.0" || version === "1.1.0") {
        url.searchParams.set("typeName", rawLayer.featureType);
    }
    else if (version === "2.0.0") {
        url.searchParams.set("typeNames", rawLayer.featureType);
    }

    return `${url.toString()}${bboxParam}`;
}

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
function createLayerSource (rawLayer, options = {}) {
    if (!options.loadingStrategy) {
        options.loadingStrategy = bbox;
    }

    const version = getVersion(rawLayer, options),
        format = new WFS({
            featureNS: rawLayer.featureNS,
            version: version
        });
    let source = null;

    function loader (extent, resolution, projection, success, failure) {
        if (options.doNotLoadInitially) {
            onLoad(source, [], onError, success, failure, options);
        }
        else if (options.wfsFilter) {
            loadWFSFilter(options.wfsFilter, rawLayer.url, source, {onErrorFn: onError, success, failure}, options);
        }
        else {
            const bboxParam = options.loadingStrategy === bbox ? `&bbox=${extent.join(",")},${projection.getCode()}` : "";
            let url = createUrl(rawLayer, version, projection, bboxParam),
                params = {};

            if (options.loadingParams) {
                for (const key in options.loadingParams) {
                    if (key === "xhrParameters") {
                        params = options.loadingParams.xhrParameters;
                        continue;
                    }
                    const option = Array.isArray(options.loadingParams[key]) ? options.loadingParams[key].join(",") : options.loadingParams[key];

                    if (option !== undefined && key === "bbox") {
                        url += `&${key}=${option},${projection.getCode()}`;
                    }
                    else if (option !== undefined) {
                        url += `&${key}=${option}`;
                    }
                }
            }
            loadWFS(url, params, source, {onErrorFn: onError, success, failure}, options);
        }
    }
    format.featureType = rawLayer.featureType;
    source = createVectorSource(loader, options.loadingStrategy, format);

    if (options.beforeLoading) {
        source.once("featuresloadstart", () => options.beforeLoading());
    }
    if (rawLayer.clusterDistance) {
        return createClusterVectorSource(source, rawLayer.clusterDistance, options.clusterGeometryFunction);
    }
    if (rawLayer.renderer === "webgl") {
        if (options.loadingStrategy === bbox) {
            source.on("featuresloadend", event => {
                webgl.afterLoading(event?.features, rawLayer.styleId, rawLayer.excludeTypesFromParsing, rawLayer.isPointLayer);
            });
        }
        else {
            source.once("featuresloadend", event => {
                webgl.afterLoading(event?.features, rawLayer.styleId, rawLayer.excludeTypesFromParsing, rawLayer.isPointLayer);
            });
        }
    }
    return source;
}

/**
 * Creates complete ol/Layer from rawLayer containing all required children.
 * @param {rawLayer} rawLayer - layer specification as in services.json
 * @param {object} [optionalParams] - optional params
 * @param {object} [optionalParams.layerParams] - additional layer params
 * @param {options} [optionalParams.options] - additional options
 * @returns {ol.Layer} Layer that can be added to map.
 */
function createLayer (rawLayer = {}, {layerParams = {}, options = {}} = {}) {
    let layer, source;

    // use WebGL render pipeline, if specified
    if (layerParams.renderer === "webgl") {
        source = createLayerSource({
            ...rawLayer,
            renderer: layerParams.renderer,
            styleId: layerParams.styleId,
            excludeTypesFromParsing: layerParams.excludeTypesFromParsing,
            isPointLayer: layerParams.isPointLayer
        }, options);
        layer = webgl.createLayer({
            ...rawLayer,
            ...layerParams,
            source
        });

        return layer;
    }

    // use default canvas renderer
    source = createLayerSource(rawLayer, options);
    layer = new VectorLayer(Object.assign({
        source,
        id: rawLayer.id
    }, layerParams));

    if (options.style) {
        layer.setStyle(options.style);
    }
    else if (rawLayer.style) {
        layer.setStyle(rawLayer.style);
    }
    return layer;
}

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

function writeTransactionBody (feature, transactionOptions, transactionMethod, version = "1.1.0") {
    const transactionPosition = {
            insert: 0,
            selectedUpdate: 1,
            delete: 2
        },
        transaction = [[], [], []];

    if (transactionMethod !== "insert" && transactionMethod !== "delete" && transactionMethod !== "selectedUpdate") {
        throw new Error("transactionMethod has to be \"insert\", \"selectedUpdate\" or \"delete\".");
    }

    transaction[transactionPosition[transactionMethod]].push(feature);
    return new XMLSerializer()
        .serializeToString(new WFS({version})
            .writeTransaction(...transaction, transactionOptions));
}

/**
 * Checks if it is an unknown or special error and returns the code and the error message
 *
 * @param {Object} xmlDocument with the error
 * @returns {Object} the code and the specific or unknown error looking like this {code, message}
 */
function getExceptionFromTransactionResponse (xmlDocument) {
    const response = {code: null, message: "genericFailedTransaction"},
        exception = xmlDocument.getElementsByTagName(`${xmlDocument.getElementsByTagName("Exception").length === 0 ? "ows:" : ""}Exception`)[0],
        exceptionText = exception.getElementsByTagName(`${xmlDocument.getElementsByTagName("ExceptionText").length === 0 ? "ows:" : ""}ExceptionText`)[0];

    if (exceptionText !== undefined) {
        response.message = exceptionText.textContent;
        console.error("WfsTransaction: An error occurred when sending the transaction to the service.", exceptionText.textContent);
    }
    else {
        response.message = "WfsTransaction: An unkown error occurred when sending the transaction to the service.";
        console.error(response.message);
    }
    if (exception?.attributes.getNamedItem("code") || exception?.attributes.getNamedItem("exceptionCode")) {
        response.code = exception.attributes.getNamedItem(`${exception?.attributes.getNamedItem("code") ? "c" : "exceptionC"}ode`).textContent;
    }

    return response;
}


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
async function sendTransaction (srsName, feature, url, layer, transactionMethod) {
    let exception,
        response,
        xmlDocument = null,
        transactionSummary = null,
        data = null,
        baseUrl = new URL(url);

    const {featureNS, featurePrefix, featureType, version} = layer;

    try {
        response = await fetch(baseUrl, {
            method: "POST",
            headers: {"Content-Type": "text/xml"},
            credentials: layer.isSecured ? "include" : "omit",
            body: writeTransactionBody(feature,
                {featureNS, featurePrefix, featureType, version, srsName},
                transactionMethod,
                version),
            responseType: "text"
        });

        data = await response.text();

        xmlDocument = new DOMParser().parseFromString(data, "text/xml");
        transactionSummary = xmlDocument.getElementsByTagName("wfs:TransactionSummary");
        if (transactionSummary.length === 0) {
            transactionSummary = xmlDocument.getElementsByTagName("TransactionSummary");
        }

        // NOTE: WFS-T services respond errors with the transaction as an XML response, even though it's the http code indicates different...
        if (transactionSummary.length === 0) {
            exception = getExceptionFromTransactionResponse(xmlDocument);
            throw new Error(exception.code ? exception.code + ": " + exception.message : exception.message);
        }
    }
    catch (e) {
        console.error(e);
        throw e;
    }

    return feature;
}

/**
 * Parses the response of a DescribeFeatureType request
 * and prepares its values for later use as an input value for the user.
 *
 * @param {string} responseData XML response data
 * @param {string} featureType Name of the feature type of the service.
 * @returns {Array} If an <element> with a name of the featureType is present, an array of prepared feature properties; else an empty Array.
 */
function parseDescribeFeatureTypeResponse (responseData, featureType) {

    const parsedResponse = new DOMParser().parseFromString(responseData, "application/xml");

    let prefix = "",
        foundElement = null;

    if (parsedResponse.getElementsByTagName("xsd:element").length > 0) {
        prefix = "xsd:";
    }
    else if (parsedResponse.getElementsByTagName("xs:element").length > 0) {
        prefix = "xs";
    }

    // Check if featureType applies to the response
    foundElement = Object.values(parsedResponse.getElementsByTagName(prefix + "element")).find(element => element.getAttribute("name") === featureType);

    if (foundElement) {
        let sequenceElements;

        if (foundElement.hasChildNodes()) {
            sequenceElements = Object.values(foundElement.getElementsByTagName(prefix + "sequence"));
        }
        else {
            sequenceElements = Object.values(parsedResponse.getElementsByTagName(prefix + "sequence"));
        }

        const elements = [];

        sequenceElements.forEach(sequenceElement => {
            elements.push(...Object.values(sequenceElement.getElementsByTagName(prefix + "element")));
        });

        return elements.map(el => Object.values(el.attributes).reduce((obj, att) => {
            if (att.localName === "minOccurs") {
                obj.required = att.value === "1";
            }
            else if (att.localName === "type") {
                if (att.value.trim().startsWith("gml")) {
                    obj.type = "geometry";
                }
                else {
                    let value = att.value;

                    if (prefix.length > 0) {
                        value = value.replace(prefix, "");
                    }

                    switch (value) {
                        case "long":
                            obj.type = "integer";
                            break;
                        default:
                            obj.type = value;
                    }
                }
            }
            else if (att.localName === "name") {
                obj.label = obj.key = att.value;
            }
            return obj;
        }, {
            label: "",
            key: "",
            value: null,
            type: "string",
            required: true
        }));
    }
    return [];
}

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
async function receivePossibleProperties (url, version, featureType, isSecured) {
    // const baseUrl = `${url}?SERVICE=WFS&REQUEST=DescribeFeatureType&VERSION=${version}&TYPENAME=${featureType}`;
    const baseUrl =createReceivePossiblePropertiesUrl(url, version, featureType);
    let response;

    try {
        response = await fetch(baseUrl, {
            responseType: "text/xml",
            credentials: isSecured ? "include" : "omit"
        });
        return parseDescribeFeatureTypeResponse(await response.text(), featureType);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
}

/**
 * Creates the Url to get possible properties from.
 *
 * @param {string} url from the WFS-T
 * @param {string} version of the WFS-T
 * @param {string} featureType Name of the FeatureType according to the capabilities document
 * @returns {URL} the created url
 */
function createReceivePossiblePropertiesUrl (url, version, featureType) {
    // const baseUrl = `${url}?SERVICE=WFS&REQUEST=DescribeFeatureType&VERSION=${version}&TYPENAME=${featureType}`;
    const baseUrl = new URL(decodeURI(url));

    baseUrl.searchParams.set("SERVICE", "WFS");
    baseUrl.searchParams.set("REQUEST", "DescribeFeatureType");
    baseUrl.searchParams.set("TYPENAME", featureType);
    if(!baseUrl.searchParams.has("VERSION") && !baseUrl.searchParams.has("version")){
        baseUrl.searchParams.set("VERSION", version);
    }
    return baseUrl;
}

/**
 * Load the features manually.
 * @param {Object} layerAttributes raw layer attributes.
 * @param {module:ol/vector/Source} layerSource - the source of the layer
 * @returns {void}
 */
function loadFeaturesManually (layerAttributes, layerSource) {
    const getUrl = createUrl(layerAttributes, layerAttributes.version, {getCode: () => layerAttributes.crs}, "");

    fetch(getUrl, layerSource)
        .then(response => response.text())
        .then(responseString => {
            layerSource.addFeatures(layerSource.getFormat().readFeatures(responseString));
        })
        .catch(error => {
            console.error(error);
        });
}

export default {createLayerSource, createLayer, createReceivePossiblePropertiesUrl, sendTransaction, receivePossibleProperties, parseDescribeFeatureTypeResponse, writeTransactionBody, loadFeaturesManually};
