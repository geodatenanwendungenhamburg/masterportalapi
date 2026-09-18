import proj4 from "proj4";

/**
 * Checks if the passed parameter is an object.
 *
 * @param {*} value parameter to check.
 * @returns {Boolean} true if the value is an object; false otherwise.
 */
function isObject (value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}

/**
 * Registers a source projection with proj4 and returns both source and destination projection objects.
 *
 * @param {String} sourceProj Source projection name (e.g. "EPSG:25832").
 * @param {String} destProj Destination projection name (e.g. "EPSG:4326").
 * @param {String} zone UTM zone of the source projection.
 * @returns {Object} An object with proj4 projection instances for sourceProj and destProj.
 */
function getProjections (sourceProj, destProj, zone) {
    proj4.defs(sourceProj, "+proj=utm +zone=" + zone + " +ellps=WGS84 +towgs84=0,0,0,0,0,0,1 +units=m +no_defs");

    return {
        sourceProj: proj4(sourceProj),
        destProj: proj4(destProj)
    };
}

const projections = getProjections("EPSG:25832", "EPSG:4326", "32");

/**
 * Transforms the given point coordinates from a given source projection to EPSG:4326.
 *
 * @param {String} sourceProjectionCode Source projection code (e.g. "EPSG:25832").
 * @param {Number[]} coords Coordinates to transform.
 * @returns {Number[]} Transformed coordinates in EPSG:4326.
 */
function transformPoint (sourceProjectionCode, coords) {
    return proj4(proj4(sourceProjectionCode), proj4("EPSG:4326"), coords);
}

/**
 * Transforms the given geometry in-place from a given source projection to EPSG:4326.
 *
 * @param {String} sourceProjectionCode Source projection code (e.g. "EPSG:25832").
 * @param {module:ol/geom/Geometry} geometry Geometry to transform.
 * @returns {module:ol/geom/Geometry} The transformed geometry.
 */
function transformGeometry (sourceProjectionCode, geometry) {
    return geometry.transform(sourceProjectionCode, "EPSG:4326");
}

export {
    isObject,
    getProjections,
    projections,
    transformGeometry,
    transformPoint
};