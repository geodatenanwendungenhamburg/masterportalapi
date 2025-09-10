/**
 * The search function uses the configured gazetteer to retrieve geospatial information
 * regarding a search string. Use the parameters to decide what to search for. At least one
 * searchX parameter must be true to start a search, or the search will be rejected.
 * @param {String} searchstring search string
 * @param {object} params parameter object
 * @param {boolean} [params.zoom = false] whether to zoom to the result if it's a single hit
 * @param {boolean} [params.zoomToParams] parameter object forwarded to ol/View.fit function {@link https://openlayers.org/en/latest/apidoc/module-ol_View.html#~FitOptions}
 * @param {ol/Map} [params.map] map object must be given if zoomTo is true
 * @param {boolean} [params.searchAddress = false] set true to search for a whole address
 * @param {boolean} [params.searchStreets = false] set true to search for streets
 * @param {boolean} [params.searchHouseNumbers = false] set true to search for house numbers; only works if searchStreets is true
 * @param {boolean} [params.searchDistricts = false] set true to search for districts
 * @param {boolean} [params.searchParcels = false] set true to search for parcels
 * @param {boolean} [params.searchStreetKey = false] set true to search for street keys
 * @param {boolean} [params.minCharacters = 3] minimum length of searchstring
 * @param {boolean} [abortPreviousSearch = false] if true the previous search is aborted
 * @returns {Promise<SearchResult[]>} resolves array of search results; rejects without value if search was canceled internally
 */
export function search(searchstring: string, params: {
    zoom?: boolean;
    zoomToParams?: boolean;
}, abortPreviousSearch?: boolean): Promise<SearchResult[]>;
