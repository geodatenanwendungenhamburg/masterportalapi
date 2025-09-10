/**
 * get value without comma and into number format
 * @param   {string|number} value the parameter
 * @returns {number} the parsed value
 */
export function getValueWithoutComma(value: string | number): number;
/**
 * Returns the reference value. If necessary it loops through the feature properties object structure.
 * @param   {object} featureProperties properties of the feature
 * @param   {string} value attribute value or object path to check
 * @returns {void} attribute property can be of any type
 */
export function getReferenceValue(featureProperties: object, value: string): void;
/**
 * Compares values according to its type.
 * @param   {string|number} featureValue value to compare
 * @param   {string|number|array} referenceValue value to compare
 * @returns {Boolean} true if values equal or in range
 */
export function compareValues(featureValue: string | number, referenceValue: string | number | any[]): boolean;
/**
 * Checks one feature against one property returning true if property satisfies condition.
 * if clustering is activated, the parameter featureProperties has an array of feautures. only the first feature
 * from the array is relevant at point, because only individual features are styled here.
 * The styling of clustered features happens in another function.
 * @param   {object} featureProperties properties of the feature that has to be checked
 * @param   {string} key attribute name or object path to check
 * @param   {string|number|array} value attribute value or object path to check
 * @returns {Boolean} true if property is satisfied. Otherwhile returns false.
 */
export function checkProperty(featureProperties: object, key: string, value: string | number | any[]): boolean;
/**
 * Loops one feature through all properties returning true if all properties are satisfied.
 * Returns also true if rule has no "conditions" to check.
 * @param   {ol/feature} feature to check
 * @param {object} rule the rule to check
 * @returns {Boolean} true if all properties are satisfied
 */
export function checkProperties(feature: any, rule: object): boolean;
