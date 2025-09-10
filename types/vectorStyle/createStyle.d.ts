declare namespace _default {
    export { isMultiGeometry };
    export { getSimpleGeometryStyle };
    export { getMultiGeometryStyle };
    export { getGeometryStyle };
    export { getLabelStyle };
    export { createStyle };
    export { returnLegendByStyleId };
}
export default _default;
/**
 * Returns true if feature contains some kind of MultiGeometry
 * @param   {string}  geometryType     the geometry type to check
 * @returns {Boolean} is geometrytype a multiGeometry
 */
declare function isMultiGeometry(geometryType: string): boolean;
/**
 * Returns the style for simple (non-multi) geometry types
 * @param   {string}  geometryType GeometryType
 * @param   {ol/feature}  feature     the ol/feature to style
 * @param   {object}  rule       styling rules to check.
 * @param   {Boolean} isClustered  Flag to show if feature is clustered.
 * @param   {String} wfsImgPathFromConfig path to wfsImg from Config
 * @returns {ol/style/Style}    style is always returned
 */
declare function getSimpleGeometryStyle(geometryType: string, feature: any, rule: object, isClustered: boolean, wfsImgPathFromConfig: string): ol;
/**
 * Returns an array of simple geometry styles.
 * @param   {string}  geometryType GeometryType
 * @param   {ol/feature}  feature     the ol/feature to style
 * @param   {object[]}  rules       styling rules to check.
 * @param   {Boolean} isClustered  Flag to show if feature is clustered.
 * @param   {String} wfsImgPathFromConfig path to wfsImg from Config
 * @returns {ol/style/Style[]}    style array of simple geometry styles is always returned
 */
declare function getMultiGeometryStyle(geometryType: string, feature: any, rules: object[], isClustered: boolean, wfsImgPathFromConfig: string): ol;
/**
 * Returns the style for the geometry object
 * @param   {ol/feature}  feature     the ol/feature to style
 * @param   {object[]}  rules       styling rules to check. Array can be empty.
 * @param   {Boolean} isClustered Flag to show if feature is clustered.
 * @param   {String} wfsImgPathFromConfig path to wfsImg from Config
 * @returns {ol/style/Style}    style is always returned
 */
declare function getGeometryStyle(feature: any, rules: object[], isClustered: boolean, wfsImgPathFromConfig: string): ol;
/**
 * Returns the style to label the object
 * @param   {ol/feature}  feature     the ol/feature to style
 * @param   {object}  style       styling rule from style.json
 * @param   {Boolean} isClustered Flag to show if feature is clustered.
 * @returns {ol/style/Text}    style is always returned
 */
declare function getLabelStyle(feature: any, style: object, isClustered: boolean): ol;
/**
     * Creates the style for the feature regarding the styleObject and sets style at feature.
     * @param   {String}  styleObject     id of the style
     * @param   {ol/feature}  feature     the feature to style
     * @param   {Boolean} isClustered is feature clustered
     * @param   {String} wfsImgPathFromConfig path to wfsImg from Config
     * @returns {ol/style/Style} style used in layer model
     */
declare function createStyle(styleObject: string, feature: any, isClustered: boolean, wfsImgPathFromConfig: string): ol;
declare function returnLegendByStyleId(styleId: any): Promise<any>;
