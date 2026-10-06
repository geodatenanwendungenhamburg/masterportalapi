import TileLayer from "ol/layer/Tile";
import WMTS from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import Projection from "ol/proj/Projection";
import proj4 from "proj4";
import WMSRasterSynchronizer from "../../../../src/maps/olcs/3dUtils/wmsRasterSynchronizer";
import ReprojectedWmtsTilingScheme from "../../../../src/maps/olcs/3dUtils/reprojectedWmtsTilingScheme";

jest.mock("olcs", () => ({AbstractSynchronizer: class {}}));

describe("wmsRasterSynchronizer.js", function () {
    let previousCesium;

    beforeEach(function () {
        previousCesium = global.Cesium;
        global.Cesium = {
            Ellipsoid: {WGS84: {}},
            Rectangle: {fromDegrees: jest.fn((west, south, east, north) => ({west, south, east, north}))},
            GeographicTilingScheme: jest.fn(),
            WebMercatorTilingScheme: jest.fn(),
            WebMapTileServiceImageryProvider: jest.fn(options => options),
            ImageryLayer: jest.fn(provider => ({imageryProvider: provider}))
        };
    });

    afterEach(function () {
        global.Cesium = previousCesium;
        jest.restoreAllMocks();
    });

    it.each([
        ["EPSG:4326", "GeographicTilingScheme"],
        ["EPSG:3857", "WebMercatorTilingScheme"]
    ])("uses the matching Cesium tiling scheme for %s", function (projection, schemeName) {
        const source = new WMTS({
                projection,
                url: "https://example.com/wmts",
                layer: "test-layer",
                matrixSet: "test-matrix-set",
                format: "image/png",
                style: "default",
                tileGrid: new WMTSTileGrid({
                    origin: [0, 0],
                    resolutions: [1],
                    matrixIds: ["0"]
                })
            }),
            layer = new TileLayer({source}),
            result = WMSRasterSynchronizer.prototype.convertLayerToCesiumImageries(layer);

        expect(result).toHaveLength(1);
        expect(result[0].imageryProvider.tilingScheme).toBeInstanceOf(Cesium[schemeName]);
        expect(result[0].imageryProvider.tileMatrixLabels).toEqual(["0"]);
    });

    it("creates projected WMTS imagery with the configured maximum level", function () {
        proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs");

        const source = new WMTS({
                projection: new Projection({code: "EPSG:25832", units: "m"}),
                url: "https://example.com/wmts",
                tileGrid: new WMTSTileGrid({
                    origin: [500000, 6000000],
                    resolutions: [100, 50],
                    matrixIds: ["0", "1"],
                    tileSize: 256
                })
            }),
            layer = new TileLayer({source});

        source.matrixSizes = [[1, 1], [2, 2]];

        const result = WMSRasterSynchronizer.prototype.convertLayerToCesiumImageries(layer);

        expect(result).toHaveLength(1);
        expect(result[0].imageryProvider.tilingScheme).toBeInstanceOf(ReprojectedWmtsTilingScheme);
        expect(result[0].imageryProvider.maximumLevel).toBe(1);
    });

    it("skips projected WMTS imagery when matrix sizes do not double cleanly", function () {
        const source = new WMTS({
                projection: new Projection({code: "EPSG:25832", units: "m"}),
                url: "https://example.com/wmts"
            }),
            layer = new TileLayer({source, name: "Projected WMTS", id: "projected-wmts"}),
            warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);

        source.matrixSizes = [[1, 1], [3, 3]];

        expect(WMSRasterSynchronizer.prototype.convertLayerToCesiumImageries(layer)).toBeNull();
        expect(Cesium.WebMapTileServiceImageryProvider).not.toHaveBeenCalled();
        expect(warn).toHaveBeenCalledWith("WMTS layer \"Projected WMTS\" (id \"projected-wmts\") uses projection EPSG:25832 with a tile matrix set Cesium cannot render; skipping 3D rendering.");
    });
});