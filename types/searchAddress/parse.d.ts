/**
 * Parses gazetteer xml to search objects.
 * @param {string} key internal name for query froms searchTypes
 * @param {string} xmlString gazetteer answer as xml string
 * @returns {Promise<SearchResult[]>} parsed response
 * @ignore
 */
export function parse(key: string, xmlString: string): Promise<SearchResult[]>;
