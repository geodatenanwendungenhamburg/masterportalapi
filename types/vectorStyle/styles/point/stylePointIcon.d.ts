/**
* Returns the rotation value and its corresponding value according to style.json.
* @param {Object} rotation - The rotation object from the style.json
* @param {Object} featureValues - The values object from the feature
* @returns {number} - The rotation value in degrees or radiants.
*/
export function getRotationValue(rotation: any, featureValues: any): number;
/**
* Creates pointStyle as icon.
* All features get same image.
* @see {@link https://community.cesium.com/t/cors-and-billboard-image/3920/2} crossOrigin: "anonymous", is necessary for the 3D mode.
* @param {Object} attributes - The attributes from the icon
* @param {Object} feature - The feature
* @param {Boolean} isClustered - true if features are clustered
* @returns {ol/style} - The created style.
*/
export function createIconStyle(attributes: any, feature: any, isClustered: boolean): ol;
/**
 * create Style for SVG
 * @param  {String} svgPath - contains the params to be draw
 * @see {@link https://community.cesium.com/t/cors-and-billboard-image/3920/2} crossOrigin: "anonymous", is necessary for the 3D mode.
 * @return {ol.Style} style
 */
export function createSVGStyle(svgPath: string): ol.Style;
