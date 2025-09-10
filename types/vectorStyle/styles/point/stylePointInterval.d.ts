/**
 * Calculate size for intervalscaled circle bar
 * @param  {number} stateValue - value from feature
 * @param  {number} circleBarScalingFactor - factor is multiplied by the stateValue
 * @param  {number} circleBarLineStroke - stroke from bar
 * @param  {number} circleBarRadius - radius from point
 * @return {number} size - size of the section to be drawn
 */
export function calculateSizeIntervalCircleBar(stateValue: number, circleBarScalingFactor: number, circleBarLineStroke: number, circleBarRadius: number): number;
/**
 * Calculate the length for the bar
 * @param  {number} size - size of the section to be drawn
 * @param  {number} circleBarRadius - radius from point
 * @param  {number} stateValue - value from feature
 * @param  {number} circleBarScalingFactor - factor is multiplied by the stateValue
 * @return {number} barLength
 */
export function calculateLengthIntervalCircleBar(size: number, circleBarRadius: number, stateValue: number, circleBarScalingFactor: number): number;
/**
 * Create SVG for intervalscaled circle bars
 * @param  {number} size - size of the section to be drawn
 * @param  {number} barLength - length from bar
 * @param  {String} circleBarCircleFillColor - fill color from circle
 * @param  {String} circleBarCircleStrokeColor - stroke color from circle
 * @param  {number} circleBarCircleStrokeWidth - stroke width from circle
 * @param  {String} circleBarLineStrokeColor - stroke color from bar
 * @param  {number} circleBarLineStroke - stroke from bar
 * @param  {number} circleBarRadius - radius from point
 * @return {String} svg
 */
export function createSvgIntervalCircleBar(size: number, barLength: number, circleBarCircleFillColor: string, circleBarCircleStrokeColor: string, circleBarCircleStrokeWidth: number, circleBarLineStrokeColor: string, circleBarLineStroke: number, circleBarRadius: number): string;
/**
 * Create interval circle bar
 * @param  {ol.Feature} feature - contains features to draw
 * @param  {ol.Feature} attributes - The attributes of the feature
 * @return {String} svg
 */
export function createIntervalCircleBar(feature: ol.Feature, attributes: ol.Feature): string;
/**
 * create interval scaled advanced style for pointFeatures
 * @param  {ol.Feature} feature - The feature
 * @param  {ol.Feature} attributes - The attributes of the feature
 * @return {ol.Style} style
 */
export function createIntervalPointStyle(feature: ol.Feature, attributes: ol.Feature): ol.Style;
