/**
 * Maps the feature properties by the given object.
 * @param {Object} properties The feature properties.
 * @param {Object} mappingObject Object to me mapped.
 * @param {Boolean} [isNested=true] Flag if Object is nested, like "gfiAttributes".
 * @returns {Object} The mapped properties.
 */
export function mapAttributes(properties: any, mappingObject: any, isNested?: boolean): any;
/**
 * checks if value starts with special prefix to determine if value is a object path
 * @param   {string} value string to check
 * @returns {Boolean} true is value is an object path
 */
export function isObjectPath(value: string): boolean;
/**
 * Returns the value of the given key. Also considers, that the key may be an object path.
 * @param {Object} properties properties.
 * @param {String} propertyKey Key to derive value from.
 * @returns {*} - Value from key.
 */
export function prepareValue(properties: any, propertyKey: string): any;
