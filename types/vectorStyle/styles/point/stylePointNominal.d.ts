/**
 * Create SVG for nominalscaled circle segments
 * @param  {number} size - size of the section to be drawn
 * @param  {number} circleSegmentsRadius - radius from circlesegment
 * @param  {String} circleSegmentsBackgroundColor - backgroundcolor from circlesegment
 * @param  {number} circleSegmentsStrokeWidth - strokewidth from circlesegment
 * @param  {String} circleSegmentsFillOpacity - opacity from circlesegment
 * @return {String} svg
 */
export function createSvgNominalCircleSegments(size: number, circleSegmentsRadius: number, circleSegmentsBackgroundColor: string, circleSegmentsStrokeWidth: number, circleSegmentsFillOpacity: string): string;
/**
 * Fills the object with values
 * @param {object} scalingAttributesAsObject - object with possible attributes as keys and values = 0
 * @param {string} scalingAttribute - actual states from feature
 * @return {Object} scalingObject - contains the states
 */
export function fillScalingAttributes(scalingAttributesAsObject: object, scalingAttribute: string): any;
/**
 * Convert scalingAttributes to object
 * @param {object} scalingValues - contains attribute with color
 * @return {object} scalingAttribute with value 0
 */
export function getScalingAttributesAsObject(scalingValues: object): object;
/**
 * Create circle segments
 * @param  {number} startAngelDegree - start with circle segment
 * @param  {number} endAngelDegree - finish with circle segment
 * @param  {number} circleRadius - radius from circle
 * @param  {number} size - size of the window to be draw
 * @param  {number} gap - gap between segments
 * @return {String} all circle segments
 */
export function calculateCircleSegment(startAngelDegree: number, endAngelDegree: number, circleRadius: number, size: number, gap: number): string;
/**
 * Extends the SVG with given tags
 * @param  {String} svg - String with svg tags
 * @param  {number} circleSegmentsStrokeWidth strokewidth from circlesegment
 * @param  {String} strokeColor - strokecolor from circlesegment
 * @param  {String} d - circle segment
 * @return {String} extended svg
 */
export function extendsSvgNominalCircleSegments(svg: string, circleSegmentsStrokeWidth: number, strokeColor: string, d: string): string;
/**
 * Create a svg with colored circle segments by nominal scaling
 * @param  {ol.Feature} feature - feature to be drawn
 * @param {Object} attributes - The attributes from the nominal circle segment
 * @return {String} svg with colored circle segments
 */
export function createNominalCircleSegments(feature: ol.Feature, attributes: any): string;
/**
 * create nominal scaled advanced style for pointFeatures
 * @param {Object} attributes - The attributes from the nominal point
 * @param {Object} feature - the feature to be drawn
 * @param {Object} defaultImageName - The image name from the default style
 * @return {ol.Style} style
 */
export function createNominalPointStyle(attributes: any, feature: any, defaultImageName: any): ol.Style;
