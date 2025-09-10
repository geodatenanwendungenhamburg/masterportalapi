/**
 * Allows setting custom styles. When available, they will be used.
 * @param {object.<string, ol.Style>} styles - lookup from feature's geometry type (Point, LineString, ...) to style
 * @returns {undefined}
 */
export function setCustomStyles(styles: object<string, ol.Style>): undefined;
export default style;
/**
 * Style function according to https://openlayers.org/en/latest/apidoc/module-ol_style_Style.html#~StyleFunction.
 * Will use custom values first, if set, and fall back on holes in definition.
 * @param {ol.Feature} feature - to be styled
 * @returns {ol.Style} style for feature
 * @ignore
 */
declare function style(feature: ol.Feature): ol.Style;
