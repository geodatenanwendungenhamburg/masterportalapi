/**
 * Encodes given string(s) to be usable as URI component.
 * @param {(string[]|string)} v value(s) to encode
 * @returns {(string[]|string)} encoded value(s)
 * @ignore
 */
export function encode(v: (string[] | string)): (string[] | string);
/**
 * Builds the part of the url query where a stored query is addressed by id.
 * @param {string} key internal name for query froms searchTypes
 * @param {(string[]|string)} v string for single-value queries, string[] for multi-value queries, strings in order of appearance in URL
 * @returns {string} URL query part like "&StoryQuery_ID=queryName&param=value"
 * @param {boolean} searchStreetBeforeWord whether to put an star in front of the search for streets (full text search)
 * @ignore
 */
export function getIdQuery(key: string, v: (string[] | string), searchStreetBeforeWord?: boolean): string;
/**
 * Retrieves xml text for a gazetteer search.
 * @param {string} key internal name for query froms searchTypes
 * @param {(string[]|string)} value value to search for
 * @param {AbortController} abortController the controller to abort the search
 * @param {boolean} searchStreetBeforeWord whether to put an star in front of the search for streets (full text search)
 * @returns {Promise<string>} xhr response text
 * @ignore
 */
export function searchGazetteer(key: string, value: (string[] | string), abortController: AbortController, searchStreetBeforeWord: boolean): Promise<string>;
