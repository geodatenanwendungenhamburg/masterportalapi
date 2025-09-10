declare namespace _default {
    export { load3DScript };
}
export default _default;
/**
 * Loads the specified JS and calls the given callback after the file has loaded. Modifies the DOM for loading.
 * @param {String} fileName - The URL to Load
 * @param {Function} callback - the Function to call after loading has completed
 * @returns {undefined}
 */
declare function load3DScript(fileName: string, callback: Function): undefined;
