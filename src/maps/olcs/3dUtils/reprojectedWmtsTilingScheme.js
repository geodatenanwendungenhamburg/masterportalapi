import proj4 from "proj4";

/**
 * Checks whether a WMTS matrix-size pyramid doubles cleanly between levels.
 * @param {Array<Array<number>>} matrixSizes The matrix sizes per tile matrix level.
 * @returns {boolean} true if each level doubles in both axes, otherwise false.
 */
function matrixSizesDoubleCleanly (matrixSizes) {
    if (!Array.isArray(matrixSizes) || matrixSizes.length === 0) {
        return false;
    }

    for (let i = 1; i < matrixSizes.length; ++i) {
        const previousSize = matrixSizes[i - 1],
            currentSize = matrixSizes[i];

        if (!Array.isArray(previousSize) || !Array.isArray(currentSize)) {
            return false;
        }
        if (currentSize[0] !== previousSize[0] * 2 || currentSize[1] !== previousSize[1] * 2) {
            return false;
        }
    }

    return true;
}

/**
 * Cesium tiling scheme that maps a WMTS tile grid in a projected CRS (e.g. EPSG:25832) to EPSG:4326,
 * so Cesium can render projected tile grids.
 */
class ReprojectedWmtsTilingScheme {
    /**
     * Creates the tiling scheme and calculates the geographic rectangle covered by the whole tile grid.
     * @param {string} code The source projection code, e.g. EPSG:25832. Must be known to proj4.
     * @param {ol.tilegrid.TileGrid} tileGrid The source WMTS tile grid.
     * @param {Array<Array<number>>} matrixSizes Matrix dimensions [width, height] per level.
     */
    constructor (code, tileGrid, matrixSizes) {
        this.code = code;
        this.tileGrid = tileGrid;
        this.matrixSizes = matrixSizes;
        this.ellipsoid = Cesium.Ellipsoid.WGS84;
        this.rectangle = this.createRectangleForWholeExtent();
    }

    /**
     * Calculates the geographic rectangle covered by all tiles of level 0.
     * @returns {Cesium.Rectangle} The rectangle in EPSG:4326 (radians).
     */
    createRectangleForWholeExtent () {
        const origin = this.tileGrid.getOrigin(0),
            resolution = this.tileGrid.getResolution(0),
            tileSize = this.tileGrid.getTileSize(0),
            tileWidth = Array.isArray(tileSize) ? tileSize[0] : tileSize,
            tileHeight = Array.isArray(tileSize) ? tileSize[1] : tileSize,
            matrixWidth = this.matrixSizes[0][0],
            matrixHeight = this.matrixSizes[0][1],
            west = origin[0],
            east = origin[0] + (matrixWidth * tileWidth * resolution),
            north = origin[1],
            south = origin[1] - (matrixHeight * tileHeight * resolution);

        return this.nativeExtentToGeographicRectangle(west, south, east, north);
    }

    /**
     * Transforms an extent of the source projection to a geographic rectangle.
     * All four corners are reprojected and the bounding box of the results is used.
     * @param {number} west Minimum x in the source projection.
     * @param {number} south Minimum y in the source projection.
     * @param {number} east Maximum x in the source projection.
     * @param {number} north Maximum y in the source projection.
     * @returns {Cesium.Rectangle} The rectangle in EPSG:4326 (radians).
     */
    nativeExtentToGeographicRectangle (west, south, east, north) {
        const corners = [
                proj4(this.code, "EPSG:4326", [west, south]),
                proj4(this.code, "EPSG:4326", [east, south]),
                proj4(this.code, "EPSG:4326", [east, north]),
                proj4(this.code, "EPSG:4326", [west, north])
            ],
            lons = corners.map(corner => corner[0]),
            lats = corners.map(corner => corner[1]),
            minLon = Math.min(...lons),
            minLat = Math.min(...lats),
            maxLon = Math.max(...lons),
            maxLat = Math.max(...lats);

        return Cesium.Rectangle.fromDegrees(minLon, minLat, maxLon, maxLat);
    }

    /**
     * Returns the number of tiles in x direction at the given level.
     * Levels beyond the configured matrix sizes are extrapolated by doubling.
     * @param {number} level The tile matrix level.
     * @returns {number} The number of tiles.
     */
    getNumberOfXTilesAtLevel (level) {
        return this.getNumberOfTilesAtLevel(level, 0);
    }

    /**
     * Returns the number of tiles in y direction at the given level.
     * Levels beyond the configured matrix sizes are extrapolated by doubling.
     * @param {number} level The tile matrix level.
     * @returns {number} The number of tiles.
     */
    getNumberOfYTilesAtLevel (level) {
        return this.getNumberOfTilesAtLevel(level, 1);
    }

    /**
     * Returns the number of tiles along one axis at the given level.
     * @param {number} level The tile matrix level.
     * @param {number} axis 0 for x (matrix width), 1 for y (matrix height).
     * @returns {number} The number of tiles.
     */
    getNumberOfTilesAtLevel (level, axis) {
        const lastLevel = this.matrixSizes.length - 1;

        return this.matrixSizes[Math.min(level, lastLevel)][axis] * Math.pow(2, Math.max(0, level - lastLevel));
    }

    /**
     * Calculates the extent of a tile in the source projection.
     * @param {number} x The tile column.
     * @param {number} y The tile row.
     * @param {number} level The tile matrix level.
     * @returns {{west: number, south: number, east: number, north: number}} The tile extent in the source projection.
     */
    tileXYToNativeRectangle (x, y, level) {
        const origin = this.tileGrid.getOrigin(level),
            resolution = this.tileGrid.getResolution(level),
            tileSize = this.tileGrid.getTileSize(level),
            tileWidth = Array.isArray(tileSize) ? tileSize[0] : tileSize,
            tileHeight = Array.isArray(tileSize) ? tileSize[1] : tileSize,
            west = origin[0] + (x * tileWidth * resolution),
            east = west + (tileWidth * resolution),
            north = origin[1] - (y * tileHeight * resolution),
            south = north - (tileHeight * resolution);

        return {west, south, east, north};
    }

    /**
     * Calculates the geographic rectangle of a tile.
     * @param {number} x The tile column.
     * @param {number} y The tile row.
     * @param {number} level The tile matrix level.
     * @returns {Cesium.Rectangle} The tile rectangle in EPSG:4326 (radians).
     */
    tileXYToRectangle (x, y, level) {
        const nativeRectangle = this.tileXYToNativeRectangle(x, y, level);

        return this.nativeExtentToGeographicRectangle(nativeRectangle.west,
            nativeRectangle.south,
            nativeRectangle.east,
            nativeRectangle.north);
    }

    /**
     * Transforms a geographic rectangle to an extent in the source projection.
     * @param {{west: number, south: number, east: number, north: number}} rectangle The rectangle in EPSG:4326 (radians).
     * @returns {{west: number, south: number, east: number, north: number}} The extent in the source projection.
     */
    rectangleToNativeRectangle (rectangle) {
        const west = Cesium.Math.toDegrees(rectangle.west),
            south = Cesium.Math.toDegrees(rectangle.south),
            east = Cesium.Math.toDegrees(rectangle.east),
            north = Cesium.Math.toDegrees(rectangle.north),
            bottomLeft = proj4("EPSG:4326", this.code, [west, south]),
            topRight = proj4("EPSG:4326", this.code, [east, north]);

        return {
            west: bottomLeft[0],
            south: bottomLeft[1],
            east: topRight[0],
            north: topRight[1]
        };
    }

    /**
     * Finds the tile containing a geographic position, clamped to the tile matrix bounds.
     * @param {Cesium.Cartographic} position The position (longitude/latitude in radians).
     * @param {number} level The tile matrix level.
     * @returns {{x: number, y: number}|undefined} The tile coordinates, undefined if the position is invalid.
     */
    positionToTileXY (position, level) {
        if (!position || !Number.isFinite(position.longitude) || !Number.isFinite(position.latitude)) {
            return undefined;
        }

        const origin = this.tileGrid.getOrigin(level),
            resolution = this.tileGrid.getResolution(level),
            tileSize = this.tileGrid.getTileSize(level),
            tileWidth = Array.isArray(tileSize) ? tileSize[0] : tileSize,
            tileHeight = Array.isArray(tileSize) ? tileSize[1] : tileSize,
            x = Cesium.Math.toDegrees(position.longitude),
            y = Cesium.Math.toDegrees(position.latitude),
            projected = proj4("EPSG:4326", this.code, [x, y]),
            tileX = Math.floor((projected[0] - origin[0]) / (tileWidth * resolution)),
            tileY = Math.floor((origin[1] - projected[1]) / (tileHeight * resolution));

        return {
            x: Math.max(0, Math.min(tileX, this.getNumberOfXTilesAtLevel(level) - 1)),
            y: Math.max(0, Math.min(tileY, this.getNumberOfYTilesAtLevel(level) - 1))
        };
    }
}

export {matrixSizesDoubleCleanly};
export default ReprojectedWmtsTilingScheme;