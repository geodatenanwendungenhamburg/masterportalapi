/**
 * Zooms the map to a geometry.
 * @param {ol/Map} map map object to zoom
 * @param {(ol/geom/SimpleGeometry|ol/extent)} geometryOrExtent the geometry or extent to zoom to
 * @param {object} [params={}] forwarded to ol/View.fit, may e.g. specify duration of animation {@link https://openlayers.org/en/latest/apidoc/module-ol_View.html#~FitOptions}
 * @returns {void}
 */
export default function zoomTo(map: any, geometryOrExtent: any, params?: object): void;
/**
 * Zooms the map to a searchResult.
 * @param {ol/Map} map map object to zoom
 * @param {SearchResult} searchResult result from searchAddress
 * @param {object} [params={}] forwarded to ol/View.fit, may e.g. specify duration of animation {@link https://openlayers.org/en/latest/apidoc/module-ol_View.html#~FitOptions}
 * @returns {void}
 */
export function zoomToSearchResult(map: any, searchResult: SearchResult, params?: object): void;
