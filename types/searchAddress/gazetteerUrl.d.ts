/**
 * Sets the gazetteerUrl to be used by the search function.
 * If parameter is falsy, url from defaults.js is kept.
 * @param {String} url url to use for searchAddress
 * @returns {void}
 */
export function setGazetteerUrl(url: string): void;
/**
 * Retrieves active gazetteer URL.
 * @returns {string} currently set gazetteer URL
 */
export function getGazetteerUrl(): string;
