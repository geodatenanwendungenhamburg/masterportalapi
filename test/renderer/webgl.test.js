import VectorSource from "ol/source/Vector.js";
import VectorTileSource from "ol/source/VectorTile";
import VectorTile from "ol/layer/VectorTile.js";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import MultiPoint from "ol/geom/MultiPoint";
import * as webgl from "../../src/renderer/webgl";
import WebGLPointsLayer from "ol/layer/WebGLPoints";
import Layer from "ol/layer/Layer";
import {returnColor} from "../../src/vectorStyle/lib/colorConvertions";

jest.mock("../../src/vectorStyle/styleList.js", () => {
    const
        original = jest.requireActual("../../src/vectorStyle/styleList.js");

    original.returnStyleObject = jest.fn(() => "xyz");
    return original;
});

describe("webgl.js", () => {
    let layerParams, layerParamsVectorTile, rawLayer, rawLayerVectorTile, styleRule, styleObject;

    beforeEach(() => {
        layerParams = {
            name: "webglTestLayer",
            id: "123",
            typ: "WFS",
            renderer: "webgl",
            styleId: "123"
        };
        rawLayer = {
            url: "https://url.de",
            name: "wfsSourceLayer",
            id: "123",
            typ: "WFS",
            version: "2.0.0",
            featureNS: "http://www.deegree.org/app",
            featureType: "krankenhaeuser_hh",
            outputFormat: "XML"
        };
        rawLayerVectorTile = {
            id: "4000",
            name: "XPLAN",
            url: "https://xplanung.ldproxy.devops.diplanung.de/rest/services/xplansyn/tiles/WebMercatorQuad/{z}/{y}/{x}?f=mvt",
            typ: "VectorTile",
            epsg: "EPSG:3857",
            tileSize: 512,
            extent: [
                902186.674876469653,
                7054472.60470921732,
                1161598.35425907862,
                7175683.41171819717
            ]
        };
        layerParamsVectorTile = {
            id: "4000",
            renderer: "webgl",
            styleId: "4000",
            visibility: true
        };
        styleRule = {style: {
            polygonFillColor: [255, 0, 0, 0.5],
            polygonStrokeColor: [0, 255, 0, 0.5],
            polygonStrokeWidth: 2,
            circleFillColor: [0, 0, 255, 0.5],
            circleRadius: 6
        }};
        styleObject = {
            rules: [styleRule]
        };
    });

    describe("createLayer", () => {
        let source = new VectorSource();

        it("should return a WebGLPointsLayer", () => {
            layerParams.isPointLayer = true;
            const webglLayer = webgl.createLayer({...rawLayer, ...layerParams, source});

            expect(webglLayer).toBeInstanceOf(WebGLPointsLayer);
            expect(webglLayer.get("isPointLayer")).toBeTruthy();
        });
        it("should return a custom Layer", () => {
            layerParams.isPointLayer = false;
            const webglLayer = webgl.createLayer({...rawLayer, ...layerParams, source});

            expect(webglLayer).toBeInstanceOf(Layer);
            expect(webglLayer).not.toBeInstanceOf(WebGLPointsLayer);
            expect(webglLayer.get("isPointLayer")).toBeFalsy();
        });
        it("vectorTile: should return a VectorTile layer", () => {
            source = new VectorTileSource({...rawLayerVectorTile, ...layerParamsVectorTile});
            layerParams.isPointLayer = false;
            const webglLayer = webgl.createLayer({...rawLayerVectorTile, ...layerParamsVectorTile, source});

            expect(webglLayer).toBeInstanceOf(Layer);
            expect(webglLayer).toBeInstanceOf(VectorTile);
            expect(webglLayer).not.toBeInstanceOf(WebGLPointsLayer);
            expect(webglLayer.get("isPointLayer")).toBeFalsy();
        });
    });
    describe("afterLoading", () => {
        const feature = new Feature({
            geometry: new MultiPoint([
                [[0, 0, 0], [1, 0, 0], [1, 1, 0]]
            ], "XYZ")
        });

        it("should extract single points from MultiPoint geometries, if isPointLayer", () => {
            webgl.afterLoading([feature], layerParams.styleId, null, true);
            expect(feature.getGeometry().getType()).toEqual("Point");
        });
    });
    describe("private format and style functions", () => {
        const
            feature = new Feature({
                geometry: new Polygon([
                    [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 0]]
                ], "XYZ"),
                apple: "42",
                pear: "true",
                pumpkin: "false"
            });
        let $feature;

        describe("formatFeatureGeometry", () => {
            it("should remove any Z components from the geometry", () => {
                $feature = feature.clone();
                webgl.formatFeatureGeometry($feature);
                /* eslint-disable-next-line max-nested-callbacks */
                expect($feature.getGeometry().getCoordinates()[0].every(coord => coord.length === 2)).toBeTruthy();
            });
        });
        describe("formatFeatureData", () => {
            it("should not format excluded formats 'number' and 'boolean", () => {
                $feature = feature.clone();
                webgl.formatFeatureData($feature, ["number", "boolean"]);
                expect(typeof $feature.get("apple")).toEqual("string");
                expect(typeof $feature.get("pear")).toEqual("string");
                expect(typeof $feature.get("pumpkin")).toEqual("string");
            });
            it("should format numbers and booleans", () => {
                $feature = feature.clone();
                webgl.formatFeatureData($feature, []);
                expect(typeof $feature.get("apple")).toEqual("number");
                expect(typeof $feature.get("pear")).toEqual("boolean");
                expect(typeof $feature.get("pumpkin")).toEqual("boolean");
            });
        });
        describe("formatFeatureStyles", () => {
            it("bind the styling rule from the styleObject to each feature", () => {
                $feature = feature.clone();
                webgl.formatFeatureStyles($feature, styleObject);
                expect($feature.styleRule).toEqual(styleRule);
            });
            it("set the necessary style attributes on the feature for literal style syntax", () => {
                $feature = feature.clone();
                webgl.formatFeatureStyles($feature, styleObject);
                expect($feature.get("fillColor")).toEqual(returnColor(styleRule.style.polygonFillColor, "hex"));
                expect($feature.get("strokeColor")).toEqual(returnColor(styleRule.style.polygonStrokeColor, "hex"));
                expect($feature.get("strokeWidth")).toEqual(styleRule.style.polygonStrokeWidth);
                expect($feature.get("opacity")).toEqual(styleRule.style.polygonFillColor[3]);
                expect($feature.get("circleSize")).toEqual(styleRule.style.circleRadius);
            });
            it("circle: bind the styling rule from the styleObject to each feature", () => {
                styleRule.style.polygonFillColor = undefined;
                styleRule.style.polygonStrokeColor = undefined;
                styleRule.style.polygonStrokeWidth = undefined;
                $feature = feature.clone();
                webgl.formatFeatureStyles($feature, styleObject);
                expect($feature.styleRule).toEqual(styleRule);
                expect($feature.get("fillColor")).toEqual(returnColor(styleRule.style.circleFillColor, "hex"));
                expect($feature.get("opacity")).toEqual(styleRule.style.circleFillColor[3]);
                expect($feature.get("circleSize")).toEqual(styleRule.style.circleRadius);
            });
        });
    });
});