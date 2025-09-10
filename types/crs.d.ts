declare namespace _default {
    export { transformFromMapProjection };
    export { transformToMapProjection };
    export { transform };
    export { getMapProjection };
    export { getProjections };
    export { registerProjections };
    export { getProjection };
}
export default _default;
/**
 * Projects a point from the given map.
 * @param {ol.Map} map - map to project from, and point must be in map's projection
 * @param {(string|object)} targetProjection - projection name or projection to project to
 * @param {number[]} point - point to project
 * @returns {(number[]|undefined)} new point or undefined
 */
declare function transformFromMapProjection(map: ol.Map, targetProjection: (string | object), point: number[]): (number[] | undefined);
/**
 * Projects a point to the given map.
 * @param {ol.Map} map - map to project to
 * @param {(string|object)} sourceProjection - projection name or projection of point
 * @param {number[]} point - point to project
 * @returns {number[]|undefined} new point or undefined
 */
declare function transformToMapProjection(map: ol.Map, sourceProjection: (string | object), point: number[]): number[] | undefined;
/**
 * Transforms a given point from a source to a target projection.
 * @param {(string|object)} sourceProjection - projection name or projection of point
 * @param {(string|object)} targetProjection - projection name or projection to project point to
 * @param {number[]} point - point to project
 * @returns {number[]|undefined} transformed point
 */
declare function transform(sourceProjection: (string | object), targetProjection: (string | object), point: number[]): number[] | undefined;
/**
 * Returns the currently active projection's name of a map's view.
 * @param {ol.Map} map - map to get projection of
 * @returns {string} active projection name of map
 */
declare function getMapProjection(map: ol.Map): string;
/**
 * Returns all known projections.
 * @returns {object[]} array of projection objects with their name added
 */
declare function getProjections(): object[];
/**
 * The configured named projections and proj4 have to be registered initially.
 * @param {string[]} [namedProjections=[
        ["EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"]
    ]] - projection name, projection definition string
 * @returns {undefined}
 */
declare function registerProjections(namedProjections?: string[]): undefined;
/**
 * Returns the proj4 projection definition for a registered name.
 * @param {string} name - projection name as written in [0] position of namedProjections
 * @returns {(object|undefined)} proj4 projection object or undefined
 */
declare function getProjection(name: string): (object | undefined);
