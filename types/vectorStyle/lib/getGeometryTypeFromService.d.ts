declare namespace _default {
    export { getGeometryTypeFromWFS };
    export { getGeometryTypeFromOAF };
    export { getSubelementsFromXML };
    export { getTypeAttributesFromSubelements };
}
export default _default;
/**
* Requests the DescribeFeatureType of the wfs layer and starts the function to parse the xml and creates the legend info
* @param   {object[]} rules styling rules from the styleObject
* @param   {string} wfsURL url from layer
* @param   {string} version wfs version from layer
* @param   {string} featureType wfs feature type from layer
* @param   {string[] | string} styleGeometryType The configured geometry type of the layer
* @param   {boolean} isSecured true if wfs is secured
* @param   {String} wfsImgPath path to wfsImg from Config
* @param {function} [callback] - called with services after loaded; called with false and error on error
* @returns {void}
*/
declare function getGeometryTypeFromWFS(rules: object[], wfsURL: string, version: string, featureType: string, styleGeometryType: string[] | string, isSecured: boolean, wfsImgPath: string, callback?: Function): void;
/**
 * Requests the geometry type of the OAF collection and creates the legend info
 * @param   {object[]} rules styling rules from the styleObject
 * @param   {string} oafURL url from layer
 * @param   {String} collection the collection name to fetch geometry type for
 * @param   {String} wfsImgPath path to wfsImg from Config
 * @param {function} [callback] - called with services after loaded; called with false and error on error
 * @returns {void}
 */
declare function getGeometryTypeFromOAF(rules: object[], oafURL: string, collection: string, wfsImgPath: string, callback?: Function): void;
/**
 * Parses the xml to get the subelements from the layer
 * @param   {string} xml response xml
 * @param   {string} featureType wfs feature type from layer. Namespace is taken into account.
 * @returns {object[]} subElements of the xml element
 */
declare function getSubelementsFromXML(xml: string, featureType: string): object[];
/**
 * Parses the geometry types from the subelements
 * @param   {Object[]} [subElements=[]] xml subelements
 * @param   {String[] | String} [styleGeometryType=null] The configured geometry type of the layer
 * @returns {String[]} geometry types of the layer
 */
declare function getTypeAttributesFromSubelements(subElements?: any[], styleGeometryType?: string[] | string): string[];
