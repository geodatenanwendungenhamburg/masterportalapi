/**
 * Returning all rules that fit to the feature. Array could be empty.
 * @param {object} styleObject the styleObject with style information
 * @param {ol/feature} feature the feature to check
 * @returns {object[]} return all rules that fit to the feature
 */
export function getRulesForFeature(styleObject: object, feature: any): object[];
/**
 * Returns the first rule that satisfies the index of the multi geometry.
 * The "sequence" must be an integer with defined min and max values representing the index range.
 * @param   {object[]} rules all rules the satisfy conditions.properties.
 * @param   {integer} index the simple geometries index
 * @returns {object|undefined} the proper rule
 */
export function getIndexedRule(rules: object[], index: integer): object | undefined;
/**
 * Returns the best rule for the indexed feature giving precedence to the index position.
 * Otherwhile returns the rule with conditions but without a sequence definition.
 * Fallback is a rule without conditions.
 * That means also: A rule with fitting properties but without fitting sequence is never used for any multi geometry.
 * @param   {object[]} rules the rules to check
 * @param   {integer} index the index position of geometry in the multi geometry
 * @returns {object|null} the rule or null if no rule match the conditions
 */
export function getRuleForIndex(rules: object[], index: integer): object | null;
