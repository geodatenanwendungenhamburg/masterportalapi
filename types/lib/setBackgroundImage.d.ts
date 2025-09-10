export default setBackgroundImage;
/**
 * Sets the configured background image to the div the map is to be rendered in.
 * @param {object} [config={}] - user configuration
 * @param {string} [config.target] - id of map div
 * @param {string} [config.backgroundImage] - image URL to set; "" means none, undefined means default
 * @returns {undefined}
 */
declare function setBackgroundImage({ backgroundImage, target }?: {
    target?: string;
    backgroundImage?: string;
}): undefined;
