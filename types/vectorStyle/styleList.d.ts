declare namespace _default {
    export { initializeStyleList };
    export { initStyleAndAddToList };
    export { addToStyleList };
    export { returnStyleObject };
}
export default _default;
/**
 * Initializes the style list with fetching the services.json.
 * [styleConf="https://geoportal-hamburg.de/lgv-config/style_v3.json"] - the URL to fetch the services from.
 * @param {object} [styleGetters] - object with the needed getters from vue store
 * @param {object} [Config] - the Config.js object
 * @param {array} [layers] - an array with the configured layers
 * @param {array} [tools] - an array with the configured tools
 * @param {function} [callback] - called with services after loaded; called with false and error on error
 * @returns {array} the list of styles
 */
declare function initializeStyleList(styleGetters?: object, Config?: object, layers?: any[], tools?: any[], callback?: Function): any[];
/**
 * Fetches the style.json file and adds the style for the styleId to the style list, if contained in style.json.
 * @param {object} [Config] - the Config.js object
 * @param {string} [styleId] - the styleId to add
 * @returns  {object} the style object for the styleId
 */
declare function initStyleAndAddToList(Config?: object, styleId?: string): object;
/**
 * adds a style to the style list
 * @param {Array} jsonStyles Array of styles
 * @returns  {void}
 */
declare function addToStyleList(jsonStyles: any[]): void;
/**
 * Returns style object by styleId or by layerId
 * @param {string} layerId layerId
 * @returns {object} style object
 */
declare function returnStyleObject(layerId: string): object;
