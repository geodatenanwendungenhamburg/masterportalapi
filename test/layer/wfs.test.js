import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import Cluster from "ol/source/Cluster.js";
import {Style, Icon} from "ol/style.js";
import map from "../../src/maps/map.js";
import defaults from "../../src/defaults";
import {WFS} from "ol/format.js";
import wfs from "../../src/layer/wfs";
import {featureCollection} from "./resources/wfsFeatures";
import {wfsFilterQuery} from "./resources/wfsFilter";
import * as webgl from "../../src/renderer/webgl.js";
import {Feature} from "ol";
import Polygon from "ol/geom/Polygon";


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


describe("wfs.js", function () {

    const originalConsoleError = console.error;

    beforeAll(() => {
        console.error = jest.fn();
    });

    afterAll(() => {
        console.error = originalConsoleError;
    });

    describe("createLayer", function () {
        it("creates a VectorLayer without id", function () {
            const layer = wfs.createLayer({version: "1.1.0"});

            expect(layer).toBeInstanceOf(VectorLayer);
            expect(layer.getSource()).toBeInstanceOf(VectorSource);
        });
        it("creates a VectorLayer without id and version", function () {
            const warn = jest.spyOn(console, "warn").mockImplementation(() => ""),
                layer = wfs.createLayer();

            expect(layer).toBeInstanceOf(VectorLayer);
            expect(layer.getSource()).toBeInstanceOf(VectorSource);
            expect(warn).toHaveBeenCalled();

            warn.mockReset();
        });
        it("creates a VectorLayer with source", function () {
            const layer = wfs.createLayer({id: "id", version: "1.1.0"});

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
            const layer = wfs.createLayer({id: "id", style: styleFunction, version: "1.1.0"});

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
                layer = wfs.createLayer({id: "id", version: "1.1.0"}, {layerParams});

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
                layer = wfs.createLayer({id: "id", version: "2.0.0"}, {layerParams, options});

            expect(layer).toBeInstanceOf(VectorLayer);
            expect(layer.get("id")).toEqual("id");
            expect(layer.getSource()).toBeInstanceOf(VectorSource);
            expect(layer.getStyleFunction()).toBeDefined();
            expect(layer.getStyleFunction()).toEqual(styleFunction);
            expect(layer.get("name")).toEqual("name");
            expect(layer.get("layers")).toEqual("layer1, layer2");
        });
        it("creates a WebGLLayer, with param renderer \"webgl\"", function () {
            const layer = wfs.createLayer({version: "1.1.0"}, {layerParams: {renderer: "webgl"}});

            expect(layer.constructor.name).toEqual("LocalWebGLLayer");
            expect(layer.getSource()).toBeInstanceOf(VectorSource);
        });
    });
    describe("createLayerSource", function () {

        it("creates a VectorSource and beforeLoading, afterLoading and featuresFilter are called", function () {
            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return featureCollection;
                        }
                    });
                });
            });

            const map2D = map.createMap(defaults),
                url = "https://url.de",
                rawLayer = {
                    id: "id",
                    url: url,
                    featureNS: "http://www.deegree.org/app",
                    featureType: "krankenhaeuser_hh",
                    version: "2.0.0"
                },
                beforeLoadingMock = jest.fn(),
                afterLoadingMock = jest.fn(),
                featuresFilterMock = jest.fn((features) => features),
                // jest.fn().mockReturnValueOnce(10),
                options = {
                    beforeLoading: beforeLoadingMock,
                    afterLoading: afterLoadingMock,
                    featuresFilter: featuresFilterMock
                },
                layer = wfs.createLayer(rawLayer, {options});

            layer.getSource().loadFeatures([-10000, -10000, 10000, 10000],
                1,
                map2D.getView().getProjection());

            expect(layer).toBeInstanceOf(VectorLayer);
            expect(layer.get("id")).toEqual("id");
            expect(layer.getSource()).toBeInstanceOf(VectorSource);
            expect(layer.getSource().getFormat()).toBeInstanceOf(WFS);
            // eslint-disable-next-line no-underscore-dangle
            expect(typeof layer.getSource().loader_).toEqual("function");
            expect(beforeLoadingMock.mock.calls.length).toBe(1);

            layer.getSource().on("featuresloadend", function () {
                expect(featuresFilterMock.mock.calls.length).toBe(1);
                expect(afterLoadingMock.mock.calls.length).toBe(1);
            });
        });
        it("creates a VectorSource with doNotLoadInitially", function () {
            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return featureCollection;
                        }
                    });
                });
            });

            const map2D = map.createMap(defaults),
                url = "https://url.de",
                rawLayer = {
                    id: "id",
                    url: url,
                    featureNS: "http://www.deegree.org/app",
                    featureType: "krankenhaeuser_hh",
                    version: "2.0.0"
                },
                beforeLoadingMock = jest.fn(),
                afterLoadingMock = jest.fn(),
                featuresFilterMock = jest.fn((features) => features),
                // jest.fn().mockReturnValueOnce(10),
                options = {
                    doNotLoadInitially: true,
                    beforeLoading: beforeLoadingMock,
                    afterLoading: afterLoadingMock,
                    featuresFilter: featuresFilterMock
                },
                layer = wfs.createLayer(rawLayer, {options});

            layer.getSource().loadFeatures([-10000, -10000, 10000, 10000],
                1,
                map2D.getView().getProjection());

            expect(layer).toBeInstanceOf(VectorLayer);
            expect(layer.get("id")).toEqual("id");
            expect(layer.getSource()).toBeInstanceOf(VectorSource);
            expect(layer.getSource().getFormat()).toBeInstanceOf(WFS);
            // eslint-disable-next-line no-underscore-dangle
            expect(typeof layer.getSource().loader_).toEqual("function");
            expect(beforeLoadingMock.mock.calls.length).toBe(1);

            layer.getSource().on("featuresloadend", function () {
                expect(featuresFilterMock.mock.calls.length).toBe(1);
                expect(afterLoadingMock.mock.calls.length).toBe(1);
            });
        });
        it("creates a VectorSource with wfsFilter", function () {
            let secondFetchCalled = false;

            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return wfsFilterQuery;
                        }
                    });
                });
            }).mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            secondFetchCalled = true;
                            return featureCollection;
                        }
                    });
                });
            });

            const map2D = map.createMap(defaults),
                url = "https://url.de",
                rawLayer = {
                    id: "id",
                    url: url,
                    featureNS: "http://www.deegree.org/app",
                    featureType: "krankenhaeuser_hh",
                    version: "1.0.0"
                },
                beforeLoadingMock = jest.fn(),
                afterLoadingMock = jest.fn(),
                featuresFilterMock = jest.fn((features) => features),
                options = {
                    wfsFilter: "resources/xml/schulstandort.staatlich.1-4.grundschulen.xml",
                    beforeLoading: beforeLoadingMock,
                    afterLoading: afterLoadingMock,
                    featuresFilter: featuresFilterMock
                },
                layer = wfs.createLayer(rawLayer, {options});

            layer.getSource().loadFeatures([-10000, -10000, 10000, 10000],
                1,
                map2D.getView().getProjection());

            expect(layer).toBeInstanceOf(VectorLayer);
            expect(layer.get("id")).toEqual("id");

            expect(layer.getSource()).toBeInstanceOf(VectorSource);
            expect(layer.getSource().getFormat()).toBeInstanceOf(WFS);
            // eslint-disable-next-line no-underscore-dangle
            expect(typeof layer.getSource().loader_).toEqual("function");
            expect(beforeLoadingMock.mock.calls.length).toBe(1);
            layer.getSource().on("featuresloadend", function () {
                expect(secondFetchCalled).toEqual(true);
                expect(featuresFilterMock.mock.calls.length).toBe(1);
                expect(afterLoadingMock.mock.calls.length).toBe(1);
            });
        });
        it("creates a VectorSource and onLoadingError is called", function () {
            global.fetch = jest.fn().mockImplementation(() => {
                // NOTE: fetch only rejects if a network error occurs, which do not apply to 4xx or 5xx http codes.
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

            const map2D = map.createMap(defaults),
                url = "https://url.de",
                rawLayer = {
                    id: "id",
                    url: url,
                    featureNS: "http://www.deegree.org/app",
                    featureType: "krankenhaeuser_hh",
                    version: "2.0.0"
                },
                onLoadingErrorMock = jest.fn(),
                options = {
                    onLoadingError: onLoadingErrorMock
                },
                layer = wfs.createLayer(rawLayer, {options});

            layer.getSource().loadFeatures([-10000, -10000, 10000, 10000],
                1,
                map2D.getView().getProjection());

            expect(layer).toBeInstanceOf(VectorLayer);
            expect(layer.get("id")).toEqual("id");
            expect(layer.getSource()).toBeInstanceOf(VectorSource);
            expect(layer.getSource().getFormat()).toBeInstanceOf(WFS);
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
                        text: () => {
                            return featureCollection;
                        }
                    });
                });
            });

            const map2D = map.createMap(defaults),
                url = "https://url.de",
                rawLayer = {
                    id: "id",
                    url: url,
                    featureNS: "http://www.deegree.org/app",
                    featureType: "krankenhaeuser_hh",
                    clusterDistance: 60,
                    version: "1.1.0"
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
                layer = wfs.createLayer(rawLayer, {options});

            layer.getSource().loadFeatures([-10000, -10000, 10000, 10000],
                1,
                map2D.getView().getProjection());

            expect(layer).toBeInstanceOf(VectorLayer);
            expect(layer.get("id")).toEqual("id");
            expect(layer.getSource()).toBeInstanceOf(Cluster);
            expect(layer.getSource().getDistance()).toEqual(60);
            expect(layer.getSource().getSource().getFormat()).toBeInstanceOf(WFS);
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
                url = "https://url.de",
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
                source = wfs.createLayerSource({
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
        it("creates a vectorSource with credentials: include as params", () => {
            global.fetch = jest.fn().mockImplementation(() => {
                // NOTE: fetch only rejects if a network error occurs, which do not apply to 4xx or 5xx http codes.
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return featureCollection;
                        }
                    });
                });
            });

            const map2D = map.createMap(defaults),
                url = "https://url.de",
                rawLayer = {
                    id: "id",
                    url: url,
                    featureNS: "http://www.deegree.org/app",
                    featureType: "krankenhaeuser_hh",
                    version: "2.0.0"
                },
                options = {
                    loadingParams: {xhrParameters: {credentials: "include"}}
                },
                layer = wfs.createLayer(rawLayer, {options});

            layer.getSource().loadFeatures([-10000, -10000, 10000, 10000],
                1,
                map2D.getView().getProjection());

            expect(fetch).toHaveBeenCalledWith("https://url.de/?service=WFS&version=2.0.0&request=GetFeature&srsName=EPSG%3A25832&typeNames=krankenhaeuser_hh&bbox=-10000,-10000,10000,10000,EPSG:25832", {"credentials": "include"});
        });
    });
    describe("parseDescribeFeatureTypeResponse", () => {
        const exampleDescribeFeatureType = "<?xml version='1.0' encoding='UTF-8'?>\n" +
                "<schema xmlns=\"http://www.w3.org/2001/XMLSchema\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:app=\"http://www.deegree.org/app\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" targetNamespace=\"http://www.deegree.org/app\" elementFormDefault=\"qualified\" attributeFormDefault=\"unqualified\">\n" +
                "  <import namespace=\"http://www.opengis.net/gml\" schemaLocation=\"http://schemas.opengis.net/gml/3.1.1/base/gml.xsd\"/>\n" +
                "  <element name=\"wfstgeom\" substitutionGroup=\"gml:_Feature\">\n" +
                "    <complexType>\n" +
                "      <complexContent>\n" +
                "        <extension base=\"gml:AbstractFeatureType\">\n" +
                "          <sequence>\n" +
                "            <element name=\"name\" minOccurs=\"0\" type=\"string\"/>\n" +
                "            <element name=\"nummer\" minOccurs=\"0\" type=\"integer\"/>\n" +
                "            <element name=\"bemerkung\" minOccurs=\"0\" type=\"string\"/>\n" +
                "            <element name=\"datum\" minOccurs=\"0\" type=\"date\"/>\n" +
                "            <element name=\"geom\" minOccurs=\"0\" type=\"gml:GeometryPropertyType\"/>\n" +
                "          </sequence>\n" +
                "        </extension>\n" +
                "      </complexContent>\n" +
                "    </complexType>\n" +
                "  </element>\n" +
                "</schema>",
            exampleProperties = [
                {
                    key: "name",
                    label: "name",
                    required: false,
                    type: "string",
                    value: null
                },
                {
                    key: "nummer",
                    label: "nummer",
                    required: false,
                    type: "integer",
                    value: null
                },
                {
                    key: "bemerkung",
                    label: "bemerkung",
                    required: false,
                    type: "string",
                    value: null
                },
                {
                    key: "datum",
                    label: "datum",
                    required: false,
                    type: "date",
                    value: null
                },
                {
                    key: "geom",
                    label: "geom",
                    required: false,
                    type: "geometry",
                    value: null
                }
            ],

            exampleDescribeFeatureType2 = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n" +
                "<xsd:schema xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:gml=\"http://www.opengis.net/gml/3.2\" xmlns:gsm_wfs=\"gsm_wfs\" xmlns:wfs=\"http://www.opengis.net/wfs/2.0\" elementFormDefault=\"qualified\" targetNamespace=\"gsm_wfs\">\n" +
                "<xsd:import namespace=\"http://www.opengis.net/gml/3.2\" schemaLocation=\"https://geoportal-konfig.muenchen.de/geoserver/schemas/gml/3.2.1/gml.xsd\"/>\n" +
                "<xsd:complexType name=\"wfstgeomType\">\n" +
                "<xsd:complexContent>\n" +
                "<xsd:extension base=\"gml:AbstractFeatureType\">\n" +
                "<xsd:sequence>\n" +
                "<xsd:element maxOccurs=\"1\" minOccurs=\"0\" name=\"name\" nillable=\"true\" type=\"xsd:string\"/>\n" +
                "<xsd:element maxOccurs=\"1\" minOccurs=\"0\" name=\"nummer\" nillable=\"true\" type=\"xsd:double\"/>\n" +
                "<xsd:element maxOccurs=\"1\" minOccurs=\"0\" name=\"shape\" nillable=\"true\" type=\"gml:GeometryPropertyType\"/>\n" +
                "</xsd:sequence>\n" +
                "</xsd:extension>\n" +
                "</xsd:complexContent>\n" +
                "</xsd:complexType>\n" +
                "<xsd:element name=\"wfstgeom\" substitutionGroup=\"gml:AbstractFeature\" type=\"gsm_wfs:kultur_rbe1_museenType\"/>\n" +
                "</xsd:schema>",

            exampleProperties2 = [
                {
                    key: "name",
                    label: "name",
                    required: false,
                    type: "string",
                    value: null
                },
                {
                    key: "nummer",
                    label: "nummer",
                    required: false,
                    type: "double",
                    value: null
                },
                {
                    key: "shape",
                    label: "shape",
                    required: false,
                    type: "geometry",
                    value: null
                }
            ];

        let featureType;

        it("should retrieve the element values (required, type, key) from the parsed XML string if an element with name = featureType can be found in the XML for Example 1", () => {
            featureType = "wfstgeom";

            const featureProperties = wfs.parseDescribeFeatureTypeResponse(exampleDescribeFeatureType, featureType);

            expect(Array.isArray(featureProperties)).toBe(true);
            expect(featureProperties.length).toEqual(5);
            exampleProperties.forEach(property => {
                const parsedProperty = featureProperties.find(({key}) => key === property.key);

                expect(parsedProperty).not.toEqual(undefined);
                expect(parsedProperty).toEqual(property);
            });
        });
        it("should return an empty array if no element with name = featureType can be found in the XML Example 1", () => {
            featureType = "myCoolType";

            const featureProperties = wfs.parseDescribeFeatureTypeResponse(exampleDescribeFeatureType, featureType);

            expect(Array.isArray(featureProperties)).toBe(true);
            expect(featureProperties.length).toEqual(0);
        });
        it("should retrieve the element values (required, type, key) from the parsed XML string if an element with name = featureType can be found in the XML for Example 2", () => {
            featureType = "wfstgeom";

            const featureProperties = wfs.parseDescribeFeatureTypeResponse(exampleDescribeFeatureType2, featureType);

            expect(Array.isArray(featureProperties)).toBe.true;
            expect(featureProperties.length).toEqual(3);

            exampleProperties2.forEach(property => {
                const parsedProperty = featureProperties.find(({key}) => key === property.key);

                expect(parsedProperty).not.toEqual(undefined);
                expect(parsedProperty).toEqual(property);
            });
        });
        it("should return an empty array if no element with name = featureType can be found in the XML Example 2", () => {
            featureType = "myCoolType";

            const featureProperties = wfs.parseDescribeFeatureTypeResponse(exampleDescribeFeatureType2, featureType);

            expect(Array.isArray(featureProperties)).toBe(true);
            expect(featureProperties.length).toEqual(0);
        });

    });
    describe("writeTransactionBody", () => {
        const feature = new Feature({
                geometry: new Polygon([
                    [
                        [
                            9.17782024967994,
                            50.20836600730087
                        ],
                        [
                            9.200676227149245,
                            50.20836600730087
                        ],
                        [
                            9.200676227149245,
                            50.20873353776312
                        ],
                        [
                            9.17782024967994,
                            50.20873353776312
                        ],
                        [
                            9.17782024967994,
                            50.20836600730087
                        ]
                    ]]),
                name: "My Polygon"
            }),

            transactionOptions = {
                featureNS: "myNS",
                featurePrefix: "myPrefix",
                featureType: "Polygon",
                srsName: "EPSG:4326"
            };


        it("should write a transaction body for inserting a feature", () => {
            const transactionBody = wfs.writeTransactionBody(feature, transactionOptions, "insert"),
                expectedBody = "<Transaction xmlns=\"http://www.opengis.net/wfs\" service=\"WFS\" version=\"1.1.0\" xmlns:ns1=\"http://www.w3.org/2001/XMLSchema-instance\" ns1:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\"><Insert><Polygon xmlns=\"myNS\"><geometry><Polygon xmlns=\"http://www.opengis.net/gml\" srsName=\"EPSG:4326\"><exterior><LinearRing srsName=\"EPSG:4326\"><posList srsDimension=\"2\">50.20836600730087 9.17782024967994 50.20836600730087 9.200676227149245 50.20873353776312 9.200676227149245 50.20873353776312 9.17782024967994 50.20836600730087 9.17782024967994</posList></LinearRing></exterior></Polygon></geometry><name>My Polygon</name></Polygon></Insert></Transaction>";

            expect(transactionBody).toEqual(expectedBody);
        });

        it("should write a transaction body for updating a feature", () => {
            feature.setId(1);
            const transactionBody = wfs.writeTransactionBody(feature, transactionOptions, "selectedUpdate"),
                expectedBody = "<Transaction xmlns=\"http://www.opengis.net/wfs\" service=\"WFS\" version=\"1.1.0\" xmlns:ns1=\"http://www.w3.org/2001/XMLSchema-instance\" ns1:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\"><Update typeName=\"myPrefix:Polygon\" xmlns:myPrefix=\"myNS\"><Property><Name>geometry</Name><Value><Polygon xmlns=\"http://www.opengis.net/gml\" srsName=\"EPSG:4326\"><exterior><LinearRing srsName=\"EPSG:4326\"><posList srsDimension=\"2\">50.20836600730087 9.17782024967994 50.20836600730087 9.200676227149245 50.20873353776312 9.200676227149245 50.20873353776312 9.17782024967994 50.20836600730087 9.17782024967994</posList></LinearRing></exterior></Polygon></Value></Property><Property><Name>name</Name><Value>My Polygon</Value></Property><Filter xmlns=\"http://www.opengis.net/ogc\"><FeatureId fid=\"1\"/></Filter></Update></Transaction>";

            expect(transactionBody).toEqual(expectedBody);
        });

        it("should write a transaction body for deleting a feature", () => {
            feature.setId(1);
            const transactionBody = wfs.writeTransactionBody(feature, transactionOptions, "delete"),
                expectedBody = "<Transaction xmlns=\"http://www.opengis.net/wfs\" service=\"WFS\" version=\"1.1.0\" xmlns:ns1=\"http://www.w3.org/2001/XMLSchema-instance\" ns1:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\"><Delete typeName=\"myPrefix:Polygon\" xmlns:myPrefix=\"myNS\"><Filter xmlns=\"http://www.opengis.net/ogc\"><FeatureId fid=\"1\"/></Filter></Delete></Transaction>";

            expect(transactionBody).toEqual(expectedBody);
        });

        it("should throw error if transactionMethod is invalid", () => {
            expect(() => wfs.writeTransactionBody(feature, transactionOptions, "remove")).toThrow(Error);
            expect(() => wfs.writeTransactionBody(feature, transactionOptions, "remove")).toThrow("transactionMethod has to be \"insert\", \"selectedUpdate\" or \"delete\".");
        });
    });

    describe("receivePossibleProperties", () => {
        const exampleDescribeFeatureType = "<?xml version='1.0' encoding='UTF-8'?>\n" +
                "<schema xmlns=\"http://www.w3.org/2001/XMLSchema\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:sf=\"http://cite.opengeospatial.org/gmlsf\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" targetNamespace=\"http://cite.opengeospatial.org/gmlsf\" elementFormDefault=\"qualified\" attributeFormDefault=\"unqualified\">\n" +
                "  <import namespace=\"http://www.opengis.net/gml\" schemaLocation=\"http://schemas.opengis.net/gml/3.1.1/base/gml.xsd\"/>\n" +
                "  <element name=\"wfstpoint\" substitutionGroup=\"gml:_Feature\">\n" +
                "    <complexType>\n" +
                "      <complexContent>\n" +
                "        <extension base=\"gml:AbstractFeatureType\">\n" +
                "          <sequence>\n" +
                "            <element name=\"geometry\" minOccurs=\"0\" type=\"gml:PointPropertyType\"/>\n" +
                "            <element name=\"name\" minOccurs=\"0\" type=\"string\"/>\n" +
                "            <element name=\"baumnummer\" minOccurs=\"0\" type=\"integer\"/>\n" +
                "            <element name=\"bemerkung\" minOccurs=\"0\" type=\"string\"/>\n" +
                "            <element name=\"datum\" minOccurs=\"0\" type=\"date\"/>\n" +
                "            <element name=\"isNew\" minOccurs=\"0\" type=\"boolean\"/>\n" +
                "            <element name=\"isUpdate\" minOccurs=\"0\" type=\"boolean\"/>\n" +
                "          </sequence>\n" +
                "        </extension>\n" +
                "      </complexContent>\n" +
                "    </complexType>\n" +
                "  </element>\n" +
                "  <element name=\"wfstline\" substitutionGroup=\"gml:_Feature\">\n" +
                "    <complexType>\n" +
                "      <complexContent>\n" +
                "        <extension base=\"gml:AbstractFeatureType\">\n" +
                "          <sequence>\n" +
                "            <element name=\"geometry\" minOccurs=\"0\" type=\"gml:LineStringPropertyType\"/>\n" +
                "            <element name=\"name\" minOccurs=\"0\" type=\"string\"/>\n" +
                "            <element name=\"nummer\" minOccurs=\"0\" type=\"integer\"/>\n" +
                "            <element name=\"bemerkung\" minOccurs=\"0\" type=\"string\"/>\n" +
                "            <element name=\"datum\" minOccurs=\"0\" type=\"date\"/>\n" +
                "          </sequence>\n" +
                "        </extension>\n" +
                "      </complexContent>\n" +
                "    </complexType>\n" +
                "  </element>\n" +
                "  <element name=\"wfstpolygon\" substitutionGroup=\"gml:_Feature\">\n" +
                "    <complexType>\n" +
                "      <complexContent>\n" +
                "        <extension base=\"gml:AbstractFeatureType\">\n" +
                "          <sequence>\n" +
                "            <element name=\"name\" minOccurs=\"0\" type=\"string\"/>\n" +
                "            <element name=\"nummer\" minOccurs=\"0\" type=\"integer\"/>\n" +
                "            <element name=\"bemerkung\" minOccurs=\"0\" type=\"string\"/>\n" +
                "            <element name=\"datum\" minOccurs=\"0\" type=\"date\"/>\n" +
                "            <element name=\"geom\" minOccurs=\"0\" type=\"gml:GeometryPropertyType\"/>\n" +
                "          </sequence>\n" +
                "        </extension>\n" +
                "      </complexContent>\n" +
                "    </complexType>\n" +
                "  </element>\n" +
                "</schema>",
            geoserverDescribeFeatureType = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><xsd:schema xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:gml=\"http://www.opengis.net/gml/3.2\" xmlns:test=\"http://opengeo.org/test\" xmlns:wfs=\"http://www.opengis.net/wfs/2.0\" elementFormDefault=\"qualified\" targetNamespace=\"http://opengeo.org/test\">\n" +
                "  <xsd:import namespace=\"http://www.opengis.net/gml/3.2\" schemaLocation=\"https://geoservice.norderstedt.de/geoserver/schemas/gml/3.2.1/gml.xsd\"/>\n" +
                "  <xsd:complexType name=\"test_polygonType\">\n" +
                "    <xsd:complexContent>\n" +
                "      <xsd:extension base=\"gml:AbstractFeatureType\">\n" +
                "        <xsd:sequence>\n" +
                "          <xsd:element maxOccurs=\"1\" minOccurs=\"0\" name=\"id\" nillable=\"true\" type=\"xsd:long\"/>\n" +
                "          <xsd:element maxOccurs=\"1\" minOccurs=\"0\" name=\"geom\" nillable=\"true\" type=\"gml:SurfacePropertyType\"/>\n" +
                "          <xsd:element maxOccurs=\"1\" minOccurs=\"0\" name=\"hochkomma\" nillable=\"true\" type=\"xsd:string\"/>\n" +
                "        </xsd:sequence>\n" +
                "      </xsd:extension>\n" +
                "    </xsd:complexContent>\n" +
                "  </xsd:complexType>\n" +
                "  <xsd:element name=\"test_polygon\" substitutionGroup=\"gml:AbstractFeature\" type=\"test:test_polygonType\"/>\n" +
                "</xsd:schema>";

        it("should receive the possible properties", async () => {
            let properties = null;
            const baseUrl = new URL("https://team-waas-was-here.lgln/?SERVICE=WFS&REQUEST=DescribeFeatureType&TYPENAME=wfstpolygon&VERSION=1.1.0"),
                options = {"credentials": "omit", "responseType": "text/xml"},
                exampleProperties = [
                    {
                        key: "name",
                        label: "name",
                        required: false,
                        type: "string",
                        value: null
                    },
                    {
                        key: "nummer",
                        label: "nummer",
                        required: false,
                        type: "integer",
                        value: null
                    },
                    {
                        key: "bemerkung",
                        label: "bemerkung",
                        required: false,
                        type: "string",
                        value: null
                    },
                    {
                        key: "datum",
                        label: "datum",
                        required: false,
                        type: "date",
                        value: null
                    },
                    {
                        key: "geom",
                        label: "geom",
                        required: false,
                        type: "geometry",
                        value: null
                    }
                ];

            baseUrl.searchParams.set("SERVICE", "WFS");
            baseUrl.searchParams.set("REQUEST", "DescribeFeatureType");
            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return exampleDescribeFeatureType;
                        }
                    });
                });
            });

            properties = await wfs.receivePossibleProperties("https://team-waas-was-here.lgln", "1.1.0", "wfstpolygon", false);

            expect(Array.isArray(properties)).toBe(true);
            expect(properties.length).toEqual(5);
            exampleProperties.forEach(property => {
                const parsedProperty = properties.find(({key}) => key === property.key);

                expect(parsedProperty).not.toEqual(undefined);
                expect(parsedProperty).toEqual(property);
            });

            expect(global.fetch).toHaveBeenCalledWith(baseUrl, options);
        });

        it("should receive the possible properties from a geoserver", async () => {
            let properties = null;
            const baseUrl = new URL("https://team-waas-was-here.lgln/?SERVICE=WFS&REQUEST=DescribeFeatureType&TYPENAME=test_polygon&VERSION=1.1.0"),
                options = {"credentials": "omit", "responseType": "text/xml"},
                exampleProperties = [
                    {
                        key: "id",
                        label: "id",
                        required: false,
                        type: "integer",
                        value: null
                    },
                    {
                        key: "geom",
                        label: "geom",
                        required: false,
                        type: "geometry",
                        value: null
                    },
                    {
                        key: "hochkomma",
                        label: "hochkomma",
                        required: false,
                        type: "string",
                        value: null
                    }
                ];

            baseUrl.searchParams.set("SERVICE", "WFS");
            baseUrl.searchParams.set("REQUEST", "DescribeFeatureType");
            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return geoserverDescribeFeatureType;
                        }
                    });
                });
            });
            properties = await wfs.receivePossibleProperties("https://team-waas-was-here.lgln", "1.1.0", "test_polygon", false);


            expect(Array.isArray(properties)).toBe(true);
            expect(properties.length).toEqual(3);
            exampleProperties.forEach(property => {
                const parsedProperty = properties.find(({key}) => key === property.key);

                expect(parsedProperty).not.toEqual(undefined);
                expect(parsedProperty).toEqual(property);
            });
            expect(global.fetch).toHaveBeenCalledWith(baseUrl, options);

        });

        it("should receive the possible properties with credentials", async () => {
            let properties = null;
            const baseUrl = new URL("https://team-waas-was-here.lgln/?SERVICE=WFS&REQUEST=DescribeFeatureType&TYPENAME=wfstpolygon&VERSION=1.1.0"),
                options = {"credentials": "include", "responseType": "text/xml"},
                exampleProperties = [
                    {
                        key: "name",
                        label: "name",
                        required: false,
                        type: "string",
                        value: null
                    },
                    {
                        key: "nummer",
                        label: "nummer",
                        required: false,
                        type: "integer",
                        value: null
                    },
                    {
                        key: "bemerkung",
                        label: "bemerkung",
                        required: false,
                        type: "string",
                        value: null
                    },
                    {
                        key: "datum",
                        label: "datum",
                        required: false,
                        type: "date",
                        value: null
                    },
                    {
                        key: "geom",
                        label: "geom",
                        required: false,
                        type: "geometry",
                        value: null
                    }
                ];

            baseUrl.searchParams.set("SERVICE", "WFS");
            baseUrl.searchParams.set("REQUEST", "DescribeFeatureType");
            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return exampleDescribeFeatureType;
                        }
                    });
                });
            });

            properties = await wfs.receivePossibleProperties("https://team-waas-was-here.lgln", "1.1.0", "wfstpolygon", true);
            expect(Array.isArray(properties)).toBe(true);
            expect(properties.length).toEqual(5);
            exampleProperties.forEach(property => {
                const parsedProperty = properties.find(({key}) => key === property.key);

                expect(parsedProperty).not.toEqual(undefined);
                expect(parsedProperty).toEqual(property);
            });
            expect(global.fetch).toHaveBeenCalledWith(baseUrl, options);

        });
    });

    describe("sendTransaction", () => {
        const layer = {
                id: Symbol("layerId"),
                url: "some.good.url",
                isSecured: false,
                featureNS: "wfsgeom",
                featurePrefix: "test",
                featureType: "Polygon",
                version: "1.1.0"
            },
            feature = new Feature({
                geometry: new Polygon([
                    [
                        [
                            9.17782024967994,
                            50.20836600730087
                        ],
                        [
                            9.200676227149245,
                            50.20836600730087
                        ],
                        [
                            9.200676227149245,
                            50.20873353776312
                        ],
                        [
                            9.17782024967994,
                            50.20873353776312
                        ],
                        [
                            9.17782024967994,
                            50.20836600730087
                        ]
                    ]]),
                name: "My Polygon"
            }),
            srsName = "EPSG:4326",
            url = "https://team-waas-was-here.lgln",
            insertTransaction = "insert",
            updateTransaction = "selectedUpdate",
            deleteTransaction = "delete",
            fetchResponseInsert = "<?xml version='1.0' encoding='UTF-8'?>\n" +
                "<wfs:TransactionResponse xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\" xmlns:wfs=\"http://www.opengis.net/wfs\" xmlns:ogc=\"http://www.opengis.net/ogc\" version=\"1.1.0\">\n" +
                "  <wfs:TransactionSummary>\n" +
                "    <wfs:totalInserted>1</wfs:totalInserted>\n" +
                "    <wfs:totalUpdated>0</wfs:totalUpdated>\n" +
                "    <wfs:totalDeleted>0</wfs:totalDeleted>\n" +
                "  </wfs:TransactionSummary>\n" +
                "  <wfs:InsertResults>\n" +
                "    <wfs:Feature>\n" +
                "      <ogc:FeatureId fid=\"wfst.59\"/>\n" +
                "    </wfs:Feature>\n" +
                "  </wfs:InsertResults>\n" +
                "</wfs:TransactionResponse>",
            fetchResponseDelete = "<?xml version='1.0' encoding='UTF-8'?>\n" +
                "<wfs:TransactionResponse xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\" xmlns:wfs=\"http://www.opengis.net/wfs\" xmlns:ogc=\"http://www.opengis.net/ogc\" version=\"1.1.0\">\n" +
                "  <wfs:TransactionSummary>\n" +
                "    <wfs:totalInserted>0</wfs:totalInserted>\n" +
                "    <wfs:totalUpdated>0</wfs:totalUpdated>\n" +
                "    <wfs:totalDeleted>1</wfs:totalDeleted>\n" +
                "  </wfs:TransactionSummary>\n" +
                "</wfs:TransactionResponse>";

        it("should return the inserted feature if the transaction was successful", async function () {
            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return fetchResponseInsert;
                        }
                    });
                });
            });

            expect(await wfs.sendTransaction(srsName, feature, url, layer, insertTransaction)).toEqual(feature);
        });

        it("should return the inserted feature if the transaction was successful", async function () {
            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return fetchResponseInsert;
                        }
                    });
                });
            });
            layer.isSecured = true;

            expect(await wfs.sendTransaction(srsName, feature, url, layer, insertTransaction)).toEqual(feature);
        });

        it("should return the updated feature if the transaction was successful", async function () {
            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return fetchResponseInsert;
                        }
                    });
                });
            });
            feature.setId(1);

            expect(await wfs.sendTransaction(srsName, feature, url, layer, updateTransaction)).toEqual(feature);
        });

        it("should return the deleted feature if the transaction was successful", async function () {
            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return fetchResponseDelete;
                        }
                    });
                });
            });
            feature.setId(1);

            expect(await wfs.sendTransaction(srsName, feature, url, layer, deleteTransaction)).toEqual(feature);
        });

        it("should throw an error if transaction type is not insert, selectedUpdate or delete", async function () {
            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return fetchResponseDelete;
                        }
                    });
                });
            });
            feature.setId(1);

            await expect(async () => wfs.sendTransaction(srsName, feature, url, layer, "lÃ¶schen")).rejects.toThrow(Error);
        });

        it("should send a request and show an alert with a generic error message if no transactionsSummary is present in the XML response", async () => {
            const failedResponse = "<?xml version='1.0' encoding='UTF-8'?>\n" +
                "<ows:ExceptionReport xmlns:ows=\"http://www.opengis.net/ows\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/ows http://schemas.opengis.net/ows/1.0.0/owsExceptionReport.xsd\" version=\"1.0.0\">\n" +
                "  <ows:Exception" +
                "    <ows:ExceptionText>Cannot perform insert operation: Error in XML document (line: 1, column: 234, character offset: 233): Feature type \"{wrong}wfst\" is unknown.</ows:ExceptionText>\n" +
                "  </ows:Exception>\n" +
                "</ows:ExceptionReport>";

            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return failedResponse;
                        }
                    });
                });
            });

            await expect(async () => wfs.sendTransaction(srsName, feature, url, layer, insertTransaction)).rejects.toThrow(Error);
        });

        it("should send a request, show an alert with a generic error message if no transactionsSummary is present in the XML response and log an error if an exceptionText is present in the XML response", async () => {
            const failedResponse = "<?xml version='1.0' encoding='UTF-8'?>\n" +
                "<ows:ExceptionReport xmlns:ows=\"http://www.opengis.net/ows\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/ows http://schemas.opengis.net/ows/1.0.0/owsExceptionReport.xsd\" version=\"1.0.0\">\n" +
                "  <ows:Exception>" +
                "    <ows:ExceptionText>Cannot perform insert operation: Error in XML document (line: 1, column: 234, character offset: 233): Feature type \"{wrong}wfst\" is unknown.</ows:ExceptionText>\n" +
                "  </ows:Exception>\n" +
                "</ows:ExceptionReport>";

            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return failedResponse;
                        }
                    });
                });
            });

            await expect(async () => wfs.sendTransaction(srsName, feature, url, layer, insertTransaction)).rejects.toThrow("Cannot perform insert operation: Error in XML document (line: 1, column: 234, character offset: 233): Feature type \"{wrong}wfst\" is unknown.");
        });
    });
    describe("createReceivePossiblePropertiesUrl", function () {
        it("url without backslash at the end", () => {
            const url = "https://team-waas-was-here.lgln",
                version = "1.1.0",
                featureType = "featureType",
                createdUrl = wfs.createReceivePossiblePropertiesUrl(url, version, featureType);

            expect(createdUrl.origin).toEqual(url);
            expect(createdUrl.searchParams.get("SERVICE")).toEqual("WFS");
            expect(createdUrl.searchParams.get("REQUEST")).toEqual("DescribeFeatureType");
            expect(createdUrl.searchParams.get("TYPENAME")).toEqual(featureType);
            expect(createdUrl.searchParams.get("VERSION")).toEqual(version);
        });

        it("url with backslash at the end", () => {
            const url = "https://team-waas-was-here.lgln/",
                version = "1.1.0",
                featureType = "featureType",
                createdUrl = wfs.createReceivePossiblePropertiesUrl(url, version, featureType);

            expect(createdUrl.origin).toEqual("https://team-waas-was-here.lgln");
            expect(createdUrl.searchParams.get("SERVICE")).toEqual("WFS");
            expect(createdUrl.searchParams.get("REQUEST")).toEqual("DescribeFeatureType");
            expect(createdUrl.searchParams.get("TYPENAME")).toEqual(featureType);
            expect(createdUrl.searchParams.get("VERSION")).toEqual(version);
        });

        it("createUrl should respect questionmark in url", () => {
            const url = "https://mapservice.regensburg.de/cgi-bin/mapserv?map=wfs.map",
                version = "1.1.0",
                featureType = "featureType",
                createdUrl = wfs.createReceivePossiblePropertiesUrl(url, version, featureType);

            expect(createdUrl.origin).toEqual("https://mapservice.regensburg.de");
            expect(createdUrl.pathname).toEqual("/cgi-bin/mapserv");
            expect(createdUrl.searchParams.get("map")).toEqual("wfs.map");
            expect(createdUrl.searchParams.get("SERVICE")).toEqual("WFS");
            expect(createdUrl.searchParams.get("REQUEST")).toEqual("DescribeFeatureType");
            expect(createdUrl.searchParams.get("TYPENAME")).toEqual(featureType);
            expect(createdUrl.searchParams.get("VERSION")).toEqual(version);
        });

        it("createUrl should respect version in url", () => {
            const url = "https://www.geosnap.info/cgi-bin/qgis_mapserv.fcgi?VERSION=1.3.0&MAP=/var/www/data/gis_data/LRARW_Burgergis/buergergis.qgz",
                version = "1.1.0",
                featureType = "featureType",
                createdUrl = wfs.createReceivePossiblePropertiesUrl(url, version, featureType);

            expect(createdUrl.origin).toEqual("https://www.geosnap.info");
            expect(createdUrl.pathname).toEqual("/cgi-bin/qgis_mapserv.fcgi");
            expect(createdUrl.searchParams.get("MAP")).toEqual("/var/www/data/gis_data/LRARW_Burgergis/buergergis.qgz");
            expect(createdUrl.searchParams.get("SERVICE")).toEqual("WFS");
            expect(createdUrl.searchParams.get("REQUEST")).toEqual("DescribeFeatureType");
            expect(createdUrl.searchParams.get("TYPENAME")).toEqual(featureType);
            expect(createdUrl.searchParams.get("VERSION")).toEqual("1.3.0");
        });

    });
    describe("loadFeaturesManually", function () {
        let tick;

        beforeEach(() => {
            tick = () => {
                return new Promise(resolve => {
                    setTimeout(resolve, 0);
                });
            };
        });

        it("load features manually", async function () {
            global.fetch = jest.fn().mockImplementation(() => {
                return new Promise((resolve) => {
                    resolve({
                        ok: true,
                        status: 200,
                        text: () => {
                            return featureCollection;
                        }
                    });
                });
            });
            const feature = new Feature({
                    geometry: new Polygon([
                        [
                            [
                                9.17782024967994,
                                50.20836600730087
                            ],
                            [
                                9.200676227149245,
                                50.20836600730087
                            ],
                            [
                                9.200676227149245,
                                50.20873353776312
                            ],
                            [
                                9.17782024967994,
                                50.20873353776312
                            ],
                            [
                                9.17782024967994,
                                50.20836600730087
                            ]
                        ]]),
                    name: "My Polygon"
                }),
                format = new WFS(),
                source = new VectorSource({
                    format: format,
                    url: "https://url.de",
                    version: "1.1.0",
                    featureType: "krankenhaeuser_hh",
                    featureNS: "http://www.deegree.org/app"
                }),
                layerAttributes = {
                    crs: "EPSG:25832",
                    version: "1.1.0",
                    url: "https://url.de"
                };

            source.getFormat().readFeatures = jest.fn().mockImplementation(() => {
                return [feature];
            });

            wfs.loadFeaturesManually(layerAttributes, source);
            await tick();
            expect(source.getFeatures()).toHaveLength(1);
        });
    });
});


