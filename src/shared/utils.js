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

function getProjections (sourceProj, destProj, zone) {
    proj4.defs(sourceProj, "+proj=utm +zone=" + zone + "ellps=WGS84 +towgs84=0,0,0,0,0,0,1 +units=m +no_defs");

    return {
        sourceProj: proj4(sourceProj),
        destProj: proj4(destProj)
    };
}

const projections = getProjections("EPSG:25832", "EPSG:4326", "32"),
    colorOptions = [
        {color: "blue", value: [55, 126, 184]},
        {color: "black", value: [0, 0, 0]},
        {color: "green", value: [77, 175, 74]},
        {color: "grey", value: [153, 153, 153]},
        {color: "orange", value: [255, 127, 0]},
        {color: "red", value: [228, 26, 28]},
        {color: "white", value: [255, 255, 255]},
        {color: "yellow", value: [255, 255, 51]}
    ];

/**
 * Checks whether bots arrays are of length 3 and whether their values are equal at the same positions.
 * Used to check if two colors are the same.
 *
 * @param {Number[]} arrOne First array.
 * @param {Number[]} arrTwo Second array.
 * @returns {Boolean} true, if both are arrays of length 3 consisting of the same values; false, else.
 */
function allCompareEqual (arrOne, arrTwo) {
    return Array.isArray(arrOne)
        && arrOne.length === 3
        && Array.isArray(arrTwo)
        && arrTwo.length === 3
        && arrOne.every((val, index) => val === arrTwo[index]);
}

/**
 * Transforms the given point coordinates from a given source projection to EPSG:4326.
 * @param {String} sourceProjectionCode source projection.
 * @param {Number[]} coords Coordinates.
 * @returns {Number[]} Transformed coordinates.
 */
function transformPoint (sourceProjectionCode, coords) {
    return proj4(proj4(sourceProjectionCode), proj4("EPSG:4326"), coords);
}

/**
 * Transforms the given geometry from a given source projection to EPSG:4326.
 * @param {String} sourceProjectionCode source projection.
 * @param {Geometry} geometry Geometry.
 * @returns {Geometry} The given geometry.
 */
function transformGeometry (sourceProjectionCode, geometry) {
    return geometry.transform(sourceProjectionCode, "EPSG:4326");
}

export {isObject, transformPoint, transformGeometry, allCompareEqual, projections, colorOptions, getProjections};
export default {
    isObject,
    getProjections,
    projections,
    colorOptions,
    allCompareEqual,
    transformGeometry,
    transformPoint
};