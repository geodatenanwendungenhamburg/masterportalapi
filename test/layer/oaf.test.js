import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import Cluster from "ol/source/Cluster.js";
import {Style, Icon} from "ol/style.js";
import map from "../../src/maps/map.js";
import defaults from "../../src/defaults";
import GeoJSON from "ol/format/GeoJSON.js";
import oaf from "../../src/layer/oaf";
import {featureCollection} from "./resources/oafFeatures";
import * as webgl from "../../src/renderer/webgl.js";

jest.mock("../../src/rawLayerList.js", () => {
    const original = jest.requireActual("../../src/rawLayerList.js");

    original.initializeLayerList = jest.fn();
    return original;
});

jest.mock("../../src/renderer/webgl.js", () => {
    const original = jest.requireActual("../../src/renderer/webgl.js");

    return {
        ...original,
        afterLoading: jest.fn()
    };
});


describe("oaf.js", function () {
    describe("createLayer", function () {
        it("creates a VectorLayer without id", function () {
            const layer = oaf.createLayer();

            expect(layer).toBeInstanceOf(VectorLayer);
            expect(layer.getSource()).toBeInstanceOf(VectorSource);
        });
        it("creates a VectorLayer with source", function () {
            const attr = {
                    "id": "id",
                    "name": "Schulen",
                    "url": "https://url",
                    "collection": "staatliche_schulen",
                    "typ": "OAF",
                    "bbox": "",
                    "bboxCrs": "",
                    "datetime": "",
                    "crs": ""
                },
                layer = oaf.createLayer(attr);

            expect(layer).toBeInstanceOf(VectorLayer);
            expect(layer.get("id")).toEqual("id");
            expect(layer.getSource()).toBeInstanceOf(VectorSource);
        });
        it("creates a VectorLayer with style in rawLayer", function () {
            function styleFunction () {
                const icon = new Style({
                    image: new Icon({
                        src: "https://building.png",
                        scale: 0.5,
                        opacity: 1
                    })
                });

                return [icon];
            }
            const layer = oaf.createLayer({id: "id", style: styleFunction});

            expect(layer).toBeInstanceOf(VectorLayer);
            expect(layer.get("id")).toEqual("id");
            expect(layer.getSource()).toBeInstanceOf(VectorSource);
            expect(layer.getStyleFunction()).toBeDefined();
            expect(layer.getStyleFunction()).toEqual(styleFunction);

        });
    });
    describe("createLayer with additional params and options", function () {
        it("creates a VectorLayer with layerParams", function () {
            const layerParams = {
                    name: "name",
                    layers: "layer1, layer2"
                },
                layer = oaf.createLayer({id: "id"}, {layerParams});

            expect(layer).toBeInstanceOf(VectorLayer);
            expect(layer.get("id")).toEqual("id");
            expect(layer.getSource()).toBeInstanceOf(VectorSource);
            expect(layer.get("name")).toEqual("name");
            expect(layer.get("layers")).toEqual("layer1, layer2");
        });
        it("creates a VectorLayer with style in options", function () {
            function styleFunction () {
                const icon = new Style({
                    image: new Icon({
                        src: "https://building.png",
                        scale: 0.5,
                        opacity: 1
                    })
                });

                return [icon];
            }
            const options = {
                    style: styleFunction
                },
                layerParams = {
                    name: "name",
                    layers: "layer1, layer2"
                },
                layer = oaf.createLayer({id: "id"}, {layerParams, options});

            expect(layer).toBeInstanceOf(VectorLayer);
            expect(layer.get("id")).toEqual("id");
            expect(layer.getSource()).toBeInstanceOf(VectorSource);
            expect(layer.getStyleFunction()).toBeDefined();
            expect(layer.getStyleFunction()).toEqual(styleFunction);
            expect(layer.get("name")).toEqual("name");
            expect(layer.get("layers")).toEqual("layer1, layer2");
        });
        it("creates a WebGLLayer, with param renderer \"webgl\"", function () {
            const layer = oaf.createLayer({id: "id"}, {layerParams: {renderer: "webgl"}});

            expect(layer.constructor.name).toEqual("LocalWebGLLayer");
            expect(layer.getSource()).toBeInstanceOf(VectorSource);
        });
    });
    describe("createLayerSource", function () {
        const consoleError = console.error;

        beforeEach(() => {
            if (global.fetch) {
                global.fetch.mockClear();
            }
        });
        // to reset show error on load in console
        afterEach(() => {
            console.error = consoleError;
        });
        it("creates a GeoJSON VectorSource", function () {
            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return {};
                        }
                    });
                });
            });
            console.error = jest.fn();

            const rawLayer = {
                    id: "id",
                    name: "Schulen",
                    url: "https://url",
                    collection: "staatliche_schulen",
                    typ: "OAF",
                    limit: 10,
                    bbox: "",
                    bboxCrs: "",
                    datetime: "",
                    crs: ""
                },
                layer = oaf.createLayer(rawLayer);

            expect(layer.getSource().getFormat()).toBeInstanceOf(GeoJSON);
        });
        it("creates a VectorSource and onLoadingError is called", function () {
            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: false,
                        status: 404,
                        text: () => {
                            return null;
                        }
                    });
                });
            });
            // to reset show error on load in console when testing 'onLoadingError'
            console.error = jest.fn();

            const rawLayer = {
                    id: "id",
                    name: "Schulen",
                    url: "https://url",
                    collection: "staatliche_schulen",
                    typ: "OAF",
                    limit: 10,
                    bbox: "",
                    bboxCrs: "",
                    datetime: "",
                    crs: ""
                },
                onLoadingErrorMock = jest.fn(),
                options = {
                    onLoadingError: onLoadingErrorMock
                },
                layer = oaf.createLayer(rawLayer, {options});

            // eslint-disable-next-line no-underscore-dangle
            expect(typeof layer.getSource().loader_).toEqual("function");
            layer.getSource().on("featuresloaderror", function () {
                expect(onLoadingErrorMock.mock.calls.length).toBe(2);
            });
        });
        it("creates a clustered VectorSource and beforeLoading, afterLoading and featuresFilter are called", function () {
            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        json: () => {
                            return featureCollection;
                        }
                    });
                });
            });
            console.error = jest.fn();

            const map2D = map.createMap(defaults),
                rawLayer = {
                    id: "id",
                    name: "Schulen",
                    url: "https://url",
                    collection: "staatliche_schulen",
                    typ: "OAF",
                    limit: 10,
                    clusterDistance: 40
                },
                beforeLoadingMock = jest.fn(),
                afterLoadingMock = jest.fn(),
                featuresFilterMock = jest.fn((features) => features),
                clusterGeometryFunctionMock = jest.fn(),
                options = {
                    beforeLoading: beforeLoadingMock,
                    afterLoading: afterLoadingMock,
                    featuresFilter: featuresFilterMock,
                    clusterGeometryFunction: clusterGeometryFunctionMock
                },
                layer = oaf.createLayer(rawLayer, {options});

            layer.getSource().getSource().loadFeatures([-1000, -1000, -1000, -1000],
                1,
                map2D.getView().getProjection());

            expect(layer.getSource()).toBeInstanceOf(Cluster);
            expect(layer.getSource().getDistance()).toEqual(40);
            expect(layer.getSource().getSource().getFormat()).toBeInstanceOf(GeoJSON);
            // eslint-disable-next-line no-underscore-dangle
            expect(typeof layer.getSource().loader_).toEqual("function");
            expect(beforeLoadingMock.mock.calls.length).toBe(1);
            layer.getSource().on("featuresloadend", function () {
                expect(clusterGeometryFunctionMock.mock.calls.length).toBe(1);
                expect(featuresFilterMock.mock.calls.length).toBe(1);
                expect(afterLoadingMock.mock.calls.length).toBe(1);
            });
        });
        it("creates a vectorSource with an additional listener, when renderer is \"webgl\"", () => {
            const
                url = "https://url",
                rawLayer = {
                    id: "id",
                    url: url,
                    featureNS: "http://www.deegree.org/app",
                    featureType: "krankenhaeuser_hh",
                    version: "1.0.0"
                },
                layerParams = {
                    renderer: "webgl",
                    styleId: "id",
                    excludeTypesFromParsing: null,
                    isPointLayer: true
                },
                source = oaf.createLayerSource({
                    ...rawLayer,
                    renderer: layerParams.renderer,
                    styleId: layerParams.styleId,
                    excludeTypesFromParsing: layerParams.excludeTypesFromParsing,
                    isPointLayer: layerParams.isPointLayer
                }),
                features = [];

            expect(source.getListeners("featuresloadend")).toHaveLength(1);
            source.getListeners("featuresloadend")[0]({features});
            expect(webgl.afterLoading).toHaveBeenCalledWith(features, layerParams.styleId, layerParams.excludeTypesFromParsing, layerParams.isPointLayer);
        });
    });
    describe("loadFeaturesManually", function () {
        it("loadFeaturesManually shall call fetch", function () {
            console.error = jest.fn();
            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        json: () => {
                            return featureCollection;
                        }
                    });
                });
            });

            const rawLayer = {
                    id: "id",
                    url: "https://url",
                    featureNS: "http://www.deegree.org/app",
                    featureType: "krankenhaeuser_hh",
                    version: "1.0.0"
                },
                options = {},
                layer = oaf.createLayer(rawLayer, {options});

            oaf.loadFeaturesManually(rawLayer, layer.getSource());

            expect(global.fetch.mock.calls.length).toBe(1);
        });
    });
    describe("createUrl", () => {
        it("should append bbox, collection, limit, datetime, bboxCrs, and crs, as provided in rawLayer", () => {
            const rawLayer = {
                    id: "id",
                    name: "Schulen",
                    url: "https://url.de",
                    collection: "staatliche_schulen",
                    typ: "OAF",
                    limit: 10,
                    bbox: [0, 0, 10, 10],
                    bboxCrs: "EPSG:4326",
                    datetime: "123",
                    crs: "EPSG:25832"
                },
                loadingParams = undefined,
                createdUrl = oaf.createUrl(rawLayer, loadingParams);

            expect(createdUrl.origin).toEqual(rawLayer.url);
            expect(createdUrl.pathname).toEqual("/collections/" + rawLayer.collection + "/items");
            expect(createdUrl.searchParams.get("limit")).toEqual("10");
            expect(createdUrl.searchParams.get("bbox")).toEqual("0,0,10,10");
            expect(createdUrl.searchParams.get("bbox-crs")).toEqual(rawLayer.bboxCrs);
            expect(createdUrl.searchParams.get("crs")).toEqual(rawLayer.crs);
            expect(createdUrl.searchParams.get("datetime")).toEqual(rawLayer.datetime);
        });
        it("should append the bbox, if provided as string in rawLayer", () => {
            const rawLayer = {
                    id: "id",
                    name: "Schulen",
                    url: "https://url.de",
                    collection: "staatliche_schulen",
                    typ: "OAF",
                    bbox: "0,0,10,10",
                    bboxCrs: "EPSG:4326"
                },
                loadingParams = undefined,
                createdUrl = oaf.createUrl(rawLayer, loadingParams);

            expect(createdUrl.origin).toEqual(rawLayer.url);
            expect(createdUrl.pathname).toEqual("/collections/" + rawLayer.collection + "/items");
            expect(createdUrl.searchParams.get("bbox")).toEqual("0,0,10,10");
            expect(createdUrl.searchParams.get("bbox-crs")).toEqual(rawLayer.bboxCrs);
        });
        it("should append the bbox, if provided as string in loadingParams", () => {
            const rawLayer = {
                    id: "id",
                    name: "Schulen",
                    url: "https://mapservice.regensburg.de/cgi-bin/mapserv?map=wfs.map",
                    collection: "staatliche_schulen",
                    typ: "OAF"
                },
                loadingParams = {bbox: "0,0,10,10"},
                createdUrl = oaf.createUrl(rawLayer, loadingParams);

            expect(createdUrl.origin).toEqual("https://mapservice.regensburg.de");
            expect(createdUrl.pathname).toEqual("/cgi-bin/mapserv/collections/" + rawLayer.collection + "/items");
            expect(createdUrl.searchParams.get("map")).toEqual("wfs.map");
            expect(createdUrl.searchParams.get("bbox")).toEqual("0,0,10,10");
        });
        it("should append additional key:value filters, if provided as in rawLayer.params", () => {
            const rawLayer = {
                    id: "id",
                    name: "Schulen",
                    url: "https://url/",
                    collection: "staatliche_schulen",
                    typ: "OAF",
                    params: {
                        kapitelbezeichnung: "Gymnasien",
                        anzahl_schueler: ">1000"
                    }
                },
                loadingParams = undefined,
                createdUrl = oaf.createUrl(rawLayer, loadingParams);

            expect(createdUrl.origin).toEqual("https://url");
            expect(createdUrl.pathname).toEqual("/collections/" + rawLayer.collection + "/items");
            expect(createdUrl.searchParams.get("kapitelbezeichnung")).toEqual("Gymnasien");
            expect(createdUrl.searchParams.get("anzahl_schueler")).toEqual(">1000");
        });
        it("should create the correct url, if the rawLayer url ends with /", () => {
            const rawLayer = {
                    id: "id",
                    name: "Schulen",
                    url: "https://url.de/ogcapi/datasets/",
                    collection: "staatliche_schulen",
                    typ: "OAF",
                    bbox: "0,0,10,10",
                    bboxCrs: "EPSG:4326"
                },
                loadingParams = undefined,
                createdUrl = oaf.createUrl(rawLayer, loadingParams);

            expect(createdUrl.origin).toEqual("https://url.de");
            expect(createdUrl.pathname).toEqual("/ogcapi/datasets/collections/" + rawLayer.collection + "/items");
        });
    });
});
