import VectorSource from "ol/source/Vector.js";
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
    let layerParams, rawLayer, styleRule, styleObject;

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
        const source = new VectorSource();

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
                expect($feature.get("FILLCOLOR")).toEqual(returnColor(styleRule.style.polygonFillColor, "hex"));
                expect($feature.get("STROKECOLOR")).toEqual(returnColor(styleRule.style.polygonStrokeColor, "hex"));
                expect($feature.get("STROKEWIDTH")).toEqual(styleRule.style.polygonStrokeWidth);
                expect($feature.get("OPACITY")).toEqual(styleRule.style.polygonFillColor[3]);
                expect($feature.get("CIRCLESIZE")).toEqual(styleRule.style.circleRadius);
            });
        });
    });
});