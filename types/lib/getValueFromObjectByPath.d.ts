/**
 * uses the given path to go into the given object and returns the value found at the end
 * @info arrays can be accessed by using a number as index (e.g. "@Test.0.test")
 * @param {Object} obj an object or array to search through
 * @param {String} path the path to follow through the given object
 * @param {String} [prefix="@"] the prefix to use to recognize the string as path to follow
 * @param {String} [delimitor="."] the delimitor to use
 * @param {Number} [depthBarrier=20] the depth barrier to avoid infinit recurtions
 * @returns {*} any value found at the end or undefined if nothing was found
 */
export function getValueFromObjectByPath(obj: any, path: string, prefix?: string, delimitor?: string, depthBarrier?: number): any;
/**
 * gets the parts of the given path splitted by ".", ignoring escaped "."
 * @param {String} path the path to split
 * @param {String} [delimitor="."] the delimitor to use
 * @returns {String[]} the resulting parts of the path
 */
export function getPathPartsFromPath(path: string, delimitor?: string): string[];
