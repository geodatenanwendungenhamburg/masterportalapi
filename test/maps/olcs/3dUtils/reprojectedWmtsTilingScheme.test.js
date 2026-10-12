import WMTSTileGrid from "ol/tilegrid/WMTS";
import proj4 from "proj4";
import ReprojectedWmtsTilingScheme, {matrixSizesDoubleCleanly} from "../../../../src/maps/olcs/3dUtils/reprojectedWmtsTilingScheme";

describe("reprojectedWmtsTilingScheme.js", function () {
    let previousCesium;

    beforeEach(function () {
        previousCesium = global.Cesium;
        global.Cesium = {
            Ellipsoid: {WGS84: {}},
            Math: {toDegrees: radians => radians * 180 / Math.PI},
            Rectangle: {
                fromDegrees: (west, south, east, north) => ({
                    west: west * Math.PI / 180,
                    south: south * Math.PI / 180,
                    east: east * Math.PI / 180,
                    north: north * Math.PI / 180
                })
            }
        };
    });

    afterEach(function () {
        global.Cesium = previousCesium;
    });

    it("accepts doubling matrix sizes and rejects non-doubling sizes", function () {
        expect(matrixSizesDoubleCleanly([[1, 1], [2, 2], [4, 4]])).toBe(true);
        expect(matrixSizesDoubleCleanly([[1, 1], [3, 3]])).toBe(false);
        expect(matrixSizesDoubleCleanly([[1, 1], [2, 4]])).toBe(false);
    });

    it("normalizes scalar and two-dimensional tile sizes", function () {
        const scalarTileGrid = new WMTSTileGrid({
                origin: [0, 90],
                resolutions: [1],
                matrixIds: ["0"],
                tileSize: 256
            }),
            arrayTileGrid = new WMTSTileGrid({
                origin: [0, 90],
                resolutions: [1],
                matrixIds: ["0"],
                tileSize: [128, 256]
            }),
            scalarScheme = new ReprojectedWmtsTilingScheme("EPSG:4326", scalarTileGrid, [[1, 1]]),
            arrayScheme = new ReprojectedWmtsTilingScheme("EPSG:4326", arrayTileGrid, [[1, 1]]);

        expect(scalarScheme.getTileSizeAtLevel(0)).toEqual([256, 256]);
        expect(arrayScheme.getTileSizeAtLevel(0)).toEqual([128, 256]);
    });

    it("returns the configured tile counts and locates a projected tile center", function () {
        proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs");

        const tileGrid = new WMTSTileGrid({
                origin: [500000, 6000000],
                resolutions: [100, 50],
                matrixIds: ["0", "1"],
                tileSize: 256
            }),
            scheme = new ReprojectedWmtsTilingScheme("EPSG:25832", tileGrid, [[1, 1], [2, 2]]),
            center = proj4("EPSG:25832", "EPSG:4326", [519200, 5980800]);

        expect(scheme.getNumberOfXTilesAtLevel(0)).toBe(1);
        expect(scheme.getNumberOfXTilesAtLevel(1)).toBe(2);
        expect(scheme.getNumberOfYTilesAtLevel(1)).toBe(2);
        expect(scheme.getNumberOfXTilesAtLevel(2)).toBe(4);
        expect(scheme.tileXYToNativeRectangle(1, 1, 1)).toEqual({west: 512800, south: 5974400, east: 525600, north: 5987200});
        expect(scheme.positionToTileXY({longitude: center[0] * Math.PI / 180, latitude: center[1] * Math.PI / 180}, 1)).toEqual({x: 1, y: 1});
        expect(scheme.rectangle.west).toBeCloseTo(9 * Math.PI / 180);
    });
});