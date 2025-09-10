declare namespace _default {
    export { getLayerWhere };
    export { getDisplayNamesOfFeatureAttributes };
    export { initializeLayerList };
    export { getLayerList };
}
export default _default;
/**
 * Returns the first entry in layerList matching the given searchAttributes.
 * @param {object} searchAttributes - key/value-pairs to be searched for, e.g. { typ: "WMS" } to get the first WMS
 * @returns {?object} first layer matching the searchAttributes or null if none was found
 */
declare function getLayerWhere(searchAttributes: object): object | null;
/**
 * Returns display names map for a layer, or display name for a specific attribute.
 * @param {string} layerId - if of layer to fetch display names for
 * @param {string} [featureAttribute] - if given, only one entry of map is returned
 * @returns {?(object|string)} - map of originalName->displayName or name of featureAttribute if specified; if layer or featureAttribute not found, null
 */
declare function getDisplayNamesOfFeatureAttributes(layerId: string, featureAttribute?: string): (object | string) | null;
/**
 * Initializes the layer list with either an object or an URL. May be used again to override the layer list.
 * createMap will call this for you, but won't notify you of when it's done. Use this function manually with a
 * callback to know when layers can be added programmatically.
 * @param {(string|object)} [layerConf="https://geoportal-hamburg.de/lgv-config/services-internet.json"] - either the URL to fetch the services from, or the object containing the services
 * @param {function} [callback] - called with services after loaded; called with false and error on error
 * @returns {undefined} nothing, add callback to receive layerList
 */
declare function initializeLayerList(layerConf?: (string | object), callback?: Function): undefined;
/** @returns {object[]} complete layerList as initialized */
declare function getLayerList(): object[];
