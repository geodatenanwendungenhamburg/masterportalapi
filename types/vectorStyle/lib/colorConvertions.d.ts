/**
 * Makes sure that one rgb color always consists of four values
 * @param {Number[]} newColor Color in rgb
 * @return {Number[]} normColor
 */
export function normalizeRgbColor(newColor: number[]): number[];
/**
 * Converts hex value to rgbarray.
 * @param {String} hex Color as hex string.
 * @returns {Number[]} - Color als rgb array.
 */
export function hexToRgb(hex: string): number[];
/**
 * Converts number to hex string.
 * @param {Number} c Color value as number.
 * @returns {String} - Converted color number as hex string.
 */
export function componentToHex(c: number): string;
/**
 * Converts rgb to hex.
 * @param {Number} r Red value.
 * @param {Number} g Green Value.
 * @param {Number} b Blue value.
 * @returns {String} - Hex color string.
 */
export function rgbToHex(r: number, g: number, b: number): string;
/**
 * Returns input color to destinated color.
 * possible values for dest are "rgb" and "hex".
 * color has to come as hex (e.g. "#ffffff" || "#fff") or as array (e.g [255,255,255,0]) or as String ("[255,255,255,0]")
 * @param {Number[]|String} color The color to return.
 * @param {String} dest Destination color type.
 * @returns {String|Number[]} - The converted color.
 */
export function returnColor(color: number[] | string, dest: string): string | number[];
