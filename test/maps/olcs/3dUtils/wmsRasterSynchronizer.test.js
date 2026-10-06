import TileLayer from "ol/layer/Tile";
import WMTS from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import Projection from "ol/proj/Projection";
import WMSRasterSynchronizer from "../../../../src/maps/olcs/3dUtils/wmsRasterSynchronizer";

jest.mock("olcs", () => ({AbstractSynchronizer: class {}}));

describe("wmsRasterSynchronizer.js", function () {
    let previousCesium;

    beforeEach(function () {
        previousCesium = global.Cesium;
        global.Cesium = {
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

    it("skips projected WMTS imagery even when matrix sizes double cleanly", function () {
        const source = new WMTS({
                projection: new Projection({code: "EPSG:25832", units: "m"}),
                url: "https://example.com/wmts"
            }),
            layer = new TileLayer({source, name: "Projected WMTS", id: "projected-wmts"}),
            warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);

        source.matrixSizes = [[1, 1], [2, 2]];

        expect(WMSRasterSynchronizer.prototype.convertLayerToCesiumImageries(layer)).toBeNull();
        expect(Cesium.WebMapTileServiceImageryProvider).not.toHaveBeenCalled();
        expect(warn).toHaveBeenCalledWith("WMTS layer \"Projected WMTS\" (id \"projected-wmts\") uses unsupported projection EPSG:25832; skipping 3D rendering.");
    });
});