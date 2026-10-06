import {get as getProjection} from "ol/proj";
import {getWidth} from "ol/extent";
import TileLayer from "ol/layer/Tile";

import wmts from "../../src/layer/wmts";

describe("wmts.js", function () {
    describe("generateArrays", function () {
        it("should fill the arrays resolutions and matrixIds with numbers", function () {
            const size = getWidth(getProjection("EPSG:3857").getExtent()) / 256,
                resLength = 20,
                resolutions = new Array(resLength),
                matrixIds = new Array(resLength);

            wmts.generateArrays(resolutions, matrixIds, resLength, size);

            resolutions.forEach((element, index) => {
                expect(typeof element).toBe("number");
                expect(resolutions[index]).toBe(size / Math.pow(2, index));
            });
            matrixIds.forEach((id, index) => {
                expect(typeof id).toBe("number");
                expect(matrixIds[index]).toBe(index);
            });
        });
    });

    describe("createLayerSourceByDefinitions", function () {
        it("should derive matrixSizes and scales when they are omitted", function () {
            const attrs = {
                    id: "wmts-derived",
                    name: "WMTS Derived",
                    coordinateSystem: "EPSG:3857",
                    tileSize: 256,
                    tileMatrixSet: "google3857",
                    layers: "test-layer",
                    format: "image/png",
                    style: "default",
                    version: "1.0.0",
                    transparent: true,
                    requestEncoding: "KVP",
                    origin: [0, 0],
                    resLength: 4,
                    urls: ["https://example.com/wmts"],
                    wrapX: false
                },
                tileLayer = new TileLayer();

            wmts.createLayerSourceByDefinitions(attrs, tileLayer);

            const resolutions = tileLayer.getSource().getTileGrid().getResolutions();

            expect(tileLayer.getSource().matrixSizes).toEqual([[1, 1], [2, 2], [4, 4], [8, 8]]);
            expect(tileLayer.getSource().scales).toHaveLength(4);
            expect(tileLayer.getSource().scales[0]).toBeCloseTo(resolutions[0] / 0.00028, 5);
            expect(tileLayer.getSource().scales[1]).toBeCloseTo(resolutions[1] / 0.00028, 5);
        });

        it("should keep explicit matrixSizes and scales unchanged", function () {
            const attrs = {
                    id: "wmts-explicit",
                    name: "WMTS Explicit",
                    coordinateSystem: "EPSG:3857",
                    tileSize: 256,
                    tileMatrixSet: "google3857",
                    layers: "test-layer",
                    format: "image/png",
                    style: "default",
                    version: "1.0.0",
                    transparent: true,
                    requestEncoding: "KVP",
                    origin: [0, 0],
                    resLength: 3,
                    urls: ["https://example.com/wmts"],
                    wrapX: false,
                    matrixSizes: [[10, 20], [20, 40], [40, 80]],
                    scales: [100, 200, 300]
                },
                tileLayer = new TileLayer();

            wmts.createLayerSourceByDefinitions(attrs, tileLayer);

            expect(tileLayer.getSource().matrixSizes).toEqual([[10, 20], [20, 40], [40, 80]]);
            expect(tileLayer.getSource().scales).toEqual([100, 200, 300]);
        });
    });
});
