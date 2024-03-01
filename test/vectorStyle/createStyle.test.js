import createStyle from "../../src/vectorStyle/createStyle";
import PointStyle from "../../src/vectorStyle/styles/point/stylePoint";
import LineStringStyle from "../../src/vectorStyle/styles/styleLine";
import PolygonStyle from "../../src/vectorStyle/styles/polygon/stylePolygon";
import {Style, Stroke, Fill} from "ol/style.js";
import {GeoJSON} from "ol/format.js";

let rules,
    jsonObjects,
    multiLineStringRules,
    multiPolygonRules,
    isClustered;

const wfsImgPathFromConfig = "/path/to/wfs/images",
    defaultStrokeColor = [0, 0, 0, 1],
    geojsonReader = new GeoJSON(),
    jsonFeatures = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [10.082125662581083, 53.518872973925404]
                },
                "properties": {
                    "id": "test1",
                    "name": "myName",
                    "value": 50,
                    "min": 10,
                    "max": 100,
                    "myObj": {
                        "myCascade": 10,
                        "myArray": [
                            {
                                "myValue": 20
                            }
                        ]
                    }
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[10.082125662581083, 53.518872973925404], [11.01, 53.6]]
                },
                "properties": {
                    "id": "test2",
                    "value": 50,
                    "min": 10,
                    "max": 100
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[10.082125662581083, 53.518872973925404], [11.01, 53.6], [11.5, 54.0]]
                },
                "properties": {
                    "id": "test1",
                    "value": 50,
                    "min": 10,
                    "max": 100
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "MultiPoint",
                    "coordinates": [[11.01, 53.6], [11.5, 54.0]]
                },
                "properties": {
                    "id": "test1",
                    "value": 50,
                    "min": 10,
                    "max": 100
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "MultiLineString",
                    "coordinates": [
                        [[10, 10], [20, 20], [10, 40]],
                        [[40, 40], [30, 30], [40, 20], [30, 10]]
                    ]
                },
                "properties": {
                    "id": "test1",
                    "value": 50,
                    "min": 10,
                    "max": 100
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "MultiPolygon",
                    "coordinates": [
                        [
                            [[30, 20], [45, 40], [10, 40], [30, 20]]
                        ],
                        [
                            [[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]
                        ]
                    ]
                },
                "properties": {
                    "id": "test1",
                    "value": 50,
                    "min": 10,
                    "max": 100
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "GeometryCollection",
                    "geometries": [
                        {
                            "type": "Point",
                            "coordinates": [100.0, 0.0]
                        },
                        {
                            "type": "LineString",
                            "coordinates": [
                                [101.0, 0.0], [102.0, 1.0]
                            ]
                        }
                    ]
                },
                "properties": {
                    "@test": "test",
                    "id": "test1",
                    "value": 50,
                    "min": 10,
                    "max": 100
                }
            }
        ]
    },
    rulesWithOneEntry = [
        {
            "conditions": {
                "sequence": [0, 0],
                "properties": {
                    "@Datastreams.0.Observations.0.result": [81, 101]}},
            "style": {
                "legendValue": "legendValueText",
                "lineStrokeColor": [37, 52, 148, 1],
                "lineStrokeDash": [20, 20, 5, 2000],
                "lineStrokeDashOffset": 20,
                "lineStrokeWidth": 5,
                "labelField": ""}}
    ],
    warn = jest.spyOn(console, "warn").mockImplementation(() => {
        null;
    });


beforeAll(function () {
    jsonObjects = geojsonReader.readFeatures(jsonFeatures);
});
afterAll(() => {
    warn.mockReset();
});

beforeEach(() => {
    isClustered = false;
    rules = [
        {
            conditions: {
                properties: {
                    id: "test1"
                }
            },
            style: {
                legendValue: "legendValueText",
                circleStrokeColor: [255, 0, 0, 1],
                type: "circle",
                lineStrokeColor: [100, 0, 0, 1],
                polygonStrokeColor: [100, 100, 0, 1]
            }
        },
        {
            style: {
                legendValue: "LineStringLegend",
                lineStrokeColor: [255, 0, 0, 1]
            }
        },
        {
            style: {
                legendValue: "PolygonLegend",
                polygonStrokeColor: [255, 0, 0, 255]
            }
        },
        {
            conditions: {
                properties: {
                    value: [0, 50, "@min", "@max"]
                }
            },
            style: {
                legendValue: "legendValueText",
                circleStrokeColor: [255, 0, 0, 1]
            }
        },
        {
            style: {
                legendValue: "legendValueText",
                circleStrokeColor: [255, 255, 255, 1]
            }
        }
    ];
    multiLineStringRules = [{
        style: {
            legendValue: "legendValueText",
            lineStrokeColor: [255, 255, 255, 1]
        }
    },
    {
        style: {
            legendValue: "legendValueText",
            lineStrokeColor: [255, 0, 0, 1]
        }
    }];
    multiPolygonRules = [{
        style: {
            legendValue: "legendValueText",
            polygonStrokeColor: [100, 100, 0, 1]
        }
    },
    {
        style: {
            legendValue: "legendValueText",
            polygonStrokeColor: [255, 0, 0, 1]
        }
    }];
});

describe("createStyle", () => {
    it("should return the correct style for a feature", () => {
        const styleObject = {styleId: "myStyle", rules: [{style: {type: "Point"}}]},
            style = createStyle.createStyle(styleObject, jsonObjects[0], isClustered, wfsImgPathFromConfig);

        expect(style).toBeInstanceOf(Style);
        expect(jsonObjects[0].getStyle()).toEqual(style);
    });

    it("should return the correct style for a feature with geometry of type MultiLineString ", () => {
        const stylingRules = [{
                "conditions": {
                    "sequence": [0, 0]
                },
                "style": {
                    "lineStrokeColor": [0, 41, 255, 1],
                    "lineStrokeDash": [10, 2000],
                    "lineStrokeDashOffset": 0,
                    "lineStrokeWidth": 4
                }
            }],
            styleObject = {styleId: "styleId", styleMultiGeomOnlyWithRule: true, rules: stylingRules},
            multiLineStringFeature = jsonObjects[4],
            style = createStyle.createStyle(styleObject, multiLineStringFeature, isClustered, wfsImgPathFromConfig);

        expect(style === null).toBe(false);
        expect(style).toBeInstanceOf(Array);
        style.forEach(aStyle => {
            expect(aStyle).toBeInstanceOf(Style);
        });
    });

    it("should return the correct style for a feature with geometry of type MultiPolygon ", () => {
        const stylingRules = [{
                "conditions": {
                    "sequence": [0, 0]
                },
                "style": {
                    "polygonStrokeColor": [
                        161,
                        113,
                        14,
                        1
                    ],
                    "polygonStrokeWidth": 0.2,
                    "polygonFillColor": [
                        161,
                        113,
                        14,
                        1
                    ]
                }
            }],
            styleObject = {styleId: "styleId", styleMultiGeomOnlyWithRule: true, rules: stylingRules},
            multiPolygonFeature = jsonObjects[5],
            style = createStyle.createStyle(styleObject, multiPolygonFeature, isClustered, wfsImgPathFromConfig);

        expect(style === null).toBe(false);
        expect(style).toBeInstanceOf(Array);
        style.forEach(aStyle => {
            expect(aStyle).toBeInstanceOf(Style);
        });
    });

    it("should return the correct style for a feature with geometry of type GeometryCollection ", () => {
        const stylingRules = [{
                "conditions": {
                    "sequence": [0, 0]
                },
                "style": {
                    "polygonStrokeColor": [
                        161,
                        113,
                        14,
                        1
                    ],
                    "polygonStrokeWidth": 0.2,
                    "polygonFillColor": [
                        161,
                        113,
                        14,
                        1
                    ]
                }
            }],
            styleObject = {styleId: "styleId", styleMultiGeomOnlyWithRule: true, rules: stylingRules},
            geometryCollectionFeature = jsonObjects[6],
            style = createStyle.createStyle(styleObject, geometryCollectionFeature, isClustered, wfsImgPathFromConfig);

        expect(style === null).toBe(false);
        expect(style).toBeInstanceOf(Array);
        style.forEach(aStyle => {
            expect(aStyle).toBeInstanceOf(Style);
        });
    });

    it("should return the correct style for a feature with geometry of type MultiPoint ", () => {
        const stylingRules = [{
                "conditions": {
                    "sequence": [0, 0]
                },
                "style": {
                    "circleRadius": 6,
                    "circleStrokeColor": [
                        24,
                        116,
                        205,
                        1
                    ],
                    "circleFillColor": [
                        135,
                        206,
                        250,
                        1
                    ]
                }
            }],
            styleObject = {styleId: "styleId", styleMultiGeomOnlyWithRule: true, rules: stylingRules},
            multiPointFeature = jsonObjects[3],
            style = createStyle.createStyle(styleObject, multiPointFeature, isClustered, wfsImgPathFromConfig);

        expect(style === null).toBe(false);
        expect(style).toBeInstanceOf(Array);
        style.forEach(aStyle => {
            expect(aStyle).toBeInstanceOf(Style);
        });
        expect(multiPointFeature.getStyle()).toEqual(style);
    });
});

describe("getSimpleGeometryStyle", function () {
    it("should return ol point style - not clustered", function () {
        const styleObject = createStyle.getSimpleGeometryStyle("Point", jsonObjects[0], rules[0], isClustered, wfsImgPathFromConfig);

        expect(styleObject).toBeInstanceOf(PointStyle);
        expect(typeof styleObject.getStyle().getImage().getStroke().getColor()).toBe("object");
        expect(styleObject.getStyle().getImage().getStroke().getColor()).toEqual([255, 0, 0, 1]);
        expect(styleObject.getLegendInfos()[0].styleObject.circleStrokeColor).toEqual([255, 0, 0, 1]);
    });
    it("should return ol linestring style - not clustered", function () {
        const styleObject = createStyle.getSimpleGeometryStyle("LineString", jsonObjects[1], rules[1], isClustered, wfsImgPathFromConfig);

        expect(styleObject).toBeInstanceOf(LineStringStyle);
        expect(typeof styleObject.getStyle().getStroke().getColor()).toBe("object");
        expect(styleObject.getStyle().getStroke().getColor()).toEqual([255, 0, 0, 1]);
        expect(styleObject.getLegendInfos()[0].styleObject.lineStrokeColor).toEqual([255, 0, 0, 1]);
    });
    it("should return ol polygon style - not clustered", function () {
        const styleObject = createStyle.getSimpleGeometryStyle("Polygon", jsonObjects[2], rules[2], isClustered, wfsImgPathFromConfig);

        expect(styleObject).toBeInstanceOf(PolygonStyle);
        expect(typeof styleObject.getStyle().getStroke().getColor()).toBe("object");
        expect(styleObject.getStyle().getStroke().getColor()).toEqual([255, 0, 0, 255]);
        expect(styleObject.getStyle().getFill().getColor()).toEqual([10, 200, 100, 0.5]);
        expect(styleObject.getLegendInfos()[0].styleObject.polygonStrokeColor).toEqual([255, 0, 0, 255]);
        expect(styleObject.getLegendInfos()[0].styleObject.polygonFillColor).toEqual([10, 200, 100, 0.5]);
    });
    it("should return ol default style - not clustered", function () {
        expect(createStyle.getSimpleGeometryStyle("not exist", jsonObjects[0], null, isClustered, wfsImgPathFromConfig)).toBeInstanceOf(Style);
    });

    it("should return ol point style - clustered", function () {
        isClustered = true;
        const styleObject = createStyle.getSimpleGeometryStyle("Point", jsonObjects[0], rules[0], isClustered, wfsImgPathFromConfig);

        expect(styleObject).toBeInstanceOf(PointStyle);
        expect(typeof styleObject).toBe("object");
        expect(styleObject.getStyle().getImage().getStroke().getColor()).toEqual(defaultStrokeColor);
        expect(styleObject.getLegendInfos()[0].styleObject.circleStrokeColor).toEqual([255, 0, 0, 1]);
    });
    it("should return ol linestring style - clustered", function () {
        isClustered = true;
        const styleObject = createStyle.getSimpleGeometryStyle("LineString", jsonObjects[1], rules[1], isClustered, wfsImgPathFromConfig);

        expect(styleObject).toBeInstanceOf(LineStringStyle);
        expect(typeof styleObject.getStyle().getStroke().getColor()).toBe("object");
        expect(styleObject.getStyle().getStroke().getColor()).toEqual([255, 0, 0, 1]);
        expect(styleObject.getLegendInfos()[0].styleObject.lineStrokeColor).toEqual([255, 0, 0, 1]);
    });
    it("should return ol polygon style - clustered", function () {
        isClustered = true;
        const styleObject = createStyle.getSimpleGeometryStyle("Polygon", jsonObjects[2], rules[2], isClustered, wfsImgPathFromConfig);

        expect(styleObject).toBeInstanceOf(PolygonStyle);
        expect(typeof styleObject.getStyle().getStroke().getColor()).toBe("object");
        expect(styleObject.getStyle().getStroke().getColor()).toEqual([255, 0, 0, 255]);
        expect(styleObject.getLegendInfos()[0].styleObject.polygonStrokeColor).toEqual([255, 0, 0, 255]);
        expect(styleObject.getLegendInfos()[0].styleObject.polygonFillColor).toEqual([10, 200, 100, 0.5]);
    });
    it("should return ol default style - clustered", function () {
        isClustered = true;
        expect(createStyle.getSimpleGeometryStyle("not exist", jsonObjects[0], null, isClustered, wfsImgPathFromConfig)).toBeInstanceOf(Style);
    });
});

describe("getMultiGeometryStyle", function () {
    it("should return style array for multipoint", function () {
        const style = createStyle.getMultiGeometryStyle("MultiPoint", jsonObjects[3], rules, isClustered, wfsImgPathFromConfig);

        expect(Array.isArray(style)).toBe(true);
        expect(style.length).toEqual(2);
    });
    it("should include ol point style - use defaultStyle for stroke color", function () {
        delete rules[0].style.circleStrokeColor;
        const style = createStyle.getMultiGeometryStyle("MultiPoint", jsonObjects[3], rules, isClustered, wfsImgPathFromConfig);

        expect(style[0]).toBeInstanceOf(PointStyle);
        expect(style[1]).toBeInstanceOf(PointStyle);
        expect(style[0].getStyle().getImage().getStroke().getColor()).toEqual(defaultStrokeColor);
        expect(style[1].getStyle().getImage().getStroke().getColor()).toEqual(defaultStrokeColor);
    });
    it("should include ol point style - is clustered and use defaultStyle for stroke color", function () {
        isClustered = true;
        delete rules[0].style.circleStrokeColor;
        const style = createStyle.getMultiGeometryStyle("MultiPoint", jsonObjects[3], rules, isClustered, wfsImgPathFromConfig);

        expect(style[0]).toBeInstanceOf(PointStyle);
        expect(style[1]).toBeInstanceOf(PointStyle);
        expect(style[0].getStyle().getImage().getStroke().getColor()).toEqual(defaultStrokeColor);
        expect(style[1].getStyle().getImage().getStroke().getColor()).toEqual(defaultStrokeColor);
    });
    it("should include ol point style- use rules for stroke color", function () {
        const style = createStyle.getMultiGeometryStyle("MultiPoint", jsonObjects[3], rules, isClustered, wfsImgPathFromConfig);

        expect(style[0]).toBeInstanceOf(PointStyle);
        expect(style[1]).toBeInstanceOf(PointStyle);
        expect(style[0].getStyle().getImage().getStroke().getColor()).toEqual(rules[0].style.circleStrokeColor);
        expect(style[1].getStyle().getImage().getStroke().getColor()).toEqual(rules[0].style.circleStrokeColor);
    });
    it("should include ol point style- is clustered and use rules for stroke color", function () {
        isClustered = true;
        rules[0].style.clusterCircleStrokeColor = [1, 2, 3, 4];
        const style = createStyle.getMultiGeometryStyle("MultiPoint", jsonObjects[3], rules, isClustered, wfsImgPathFromConfig);

        expect(style[0]).toBeInstanceOf(PointStyle);
        expect(style[1]).toBeInstanceOf(PointStyle);
        expect(style[0].getStyle().getImage().getStroke().getColor()).toEqual(rules[0].style.clusterCircleStrokeColor);
        expect(style[1].getStyle().getImage().getStroke().getColor()).toEqual(rules[0].style.clusterCircleStrokeColor);
    });
    it("should return style array for MultiLineString", function () {
        const style = createStyle.getMultiGeometryStyle("MultiLineString", jsonObjects[4], multiLineStringRules, isClustered, wfsImgPathFromConfig);

        expect(Array.isArray(style)).toBe(true);
        expect(style.length).toEqual(2);
    });
    it("MultiLineString: should include ol line style - use defaultStyle for stroke color", function () {
        delete multiLineStringRules[0].style.lineStrokeColor;
        delete multiLineStringRules[1].style.lineStrokeColor;
        const style = createStyle.getMultiGeometryStyle("MultiLineString", jsonObjects[4], multiLineStringRules, isClustered, wfsImgPathFromConfig);

        expect(style[0]).toBeInstanceOf(LineStringStyle);
        expect(style[1]).toBeInstanceOf(LineStringStyle);
        expect(style[0].getStyle().getStroke()).toBeInstanceOf(Stroke);
        expect(style[1].getStyle().getStroke()).toBeInstanceOf(Stroke);
        expect(style[0].getStyle().getStroke().getColor()).toEqual(defaultStrokeColor);
        expect(style[1].getStyle().getStroke().getColor()).toEqual(defaultStrokeColor);
    });
    it("MultiLineString: should include ol line style - use rules for stroke color", function () {
        const style = createStyle.getMultiGeometryStyle("MultiLineString", jsonObjects[4], multiLineStringRules, isClustered, wfsImgPathFromConfig);

        expect(style[0]).toBeInstanceOf(LineStringStyle);
        expect(style[1]).toBeInstanceOf(LineStringStyle);
        expect(style[0].getStyle().getStroke()).toBeInstanceOf(Stroke);
        expect(style[1].getStyle().getStroke()).toBeInstanceOf(Stroke);
        expect(style[0].getStyle().getStroke().getColor()).toEqual(multiLineStringRules[0].style.lineStrokeColor);
        expect(style[1].getStyle().getStroke().getColor()).toEqual(multiLineStringRules[0].style.lineStrokeColor);
    });
    it("should return style array for MultiPolygon", function () {
        const style = createStyle.getMultiGeometryStyle("MultiPolygon", jsonObjects[5], multiPolygonRules, isClustered, wfsImgPathFromConfig);

        expect(Array.isArray(style)).toBe(true);
        expect(style.length).toEqual(2);
    });
    it("should include ol polygon style - use defaultStyle for stroke color", function () {
        delete multiPolygonRules[0].style.polygonStrokeColor;
        delete multiPolygonRules[1].style.polygonStrokeColor;
        const style = createStyle.getMultiGeometryStyle("MultiPolygon", jsonObjects[5], multiPolygonRules, isClustered, wfsImgPathFromConfig);

        expect(style[0]).toBeInstanceOf(PolygonStyle);
        expect(style[0].getStyle().getStroke()).toBeInstanceOf(Stroke);
        expect(style[0].getStyle().getFill()).toBeInstanceOf(Fill);
        expect(style[0].getStyle().getStroke().getColor()).toEqual(defaultStrokeColor);
        expect(style[1].getStyle().getStroke()).toBeInstanceOf(Stroke);
        expect(style[1].getStyle().getFill()).toBeInstanceOf(Fill);
        expect(style[1].getStyle().getStroke().getColor()).toEqual(defaultStrokeColor);
    });
    it("should include ol polygon style - use rules for stroke color", function () {
        const style = createStyle.getMultiGeometryStyle("MultiPolygon", jsonObjects[5], multiPolygonRules, isClustered, wfsImgPathFromConfig);

        expect(style[0]).toBeInstanceOf(PolygonStyle);
        expect(style[0].getStyle().getStroke()).toBeInstanceOf(Stroke);
        expect(style[0].getStyle().getFill()).toBeInstanceOf(Fill);
        expect(style[0].getStyle().getStroke().getColor()).toEqual(multiPolygonRules[0].style.polygonStrokeColor);
        expect(style[1].getStyle().getStroke()).toBeInstanceOf(Stroke);
        expect(style[1].getStyle().getFill()).toBeInstanceOf(Fill);
        expect(style[1].getStyle().getStroke().getColor()).toEqual(multiPolygonRules[0].style.polygonStrokeColor);
    });
    it("should return style array for GeometryCollection", function () {
        const style = createStyle.getMultiGeometryStyle("GeometryCollection", jsonObjects[6], rules, isClustered, wfsImgPathFromConfig);

        expect(Array.isArray(style)).toBe(true);
        expect(style.length).toEqual(2);
    });
    it("should include ol line and point style - use defaultStyle for stroke color", function () {
        delete rules[0].style.circleStrokeColor;
        delete rules[0].style.lineStrokeColor;
        delete multiLineStringRules[0].style.lineStrokeColor;
        const style = createStyle.getMultiGeometryStyle("GeometryCollection", jsonObjects[6], rules, isClustered, wfsImgPathFromConfig),
            multiLineStyle = createStyle.getMultiGeometryStyle("GeometryCollection", jsonObjects[6], multiLineStringRules, isClustered, wfsImgPathFromConfig);

        expect(style[0]).toBeInstanceOf(PointStyle);
        expect(style[0].getStyle().getImage().getStroke()).toBeInstanceOf(Stroke);
        expect(style[0].getStyle().getImage().getStroke().getColor()).toEqual(defaultStrokeColor);
        expect(style[1]).toBeInstanceOf(LineStringStyle);
        expect(style[1].getStyle().getStroke()).toBeInstanceOf(Stroke);
        expect(style[1].getStyle().getStroke().getColor()).toEqual(defaultStrokeColor);

        expect(multiLineStyle[0]).toBeInstanceOf(PointStyle);
        expect(multiLineStyle[0].getStyle().getImage().getStroke().getColor()).toEqual(defaultStrokeColor);
        expect(multiLineStyle[1]).toBeInstanceOf(LineStringStyle);
        expect(multiLineStyle[1].getStyle().getStroke()).toBeInstanceOf(Stroke);
        expect(multiLineStyle[1].getStyle().getStroke().getColor()).toEqual(defaultStrokeColor);
    });
    it("should include ol line and point style - use rules for stroke color", function () {
        const style = createStyle.getMultiGeometryStyle("GeometryCollection", jsonObjects[6], rules, isClustered, wfsImgPathFromConfig),
            multiLineStyle = createStyle.getMultiGeometryStyle("GeometryCollection", jsonObjects[6], multiLineStringRules, isClustered, wfsImgPathFromConfig);

        expect(style[0]).toBeInstanceOf(PointStyle);
        expect(style[0].getStyle().getImage().getStroke()).toBeInstanceOf(Stroke);
        expect(style[0].getStyle().getImage().getStroke().getColor()).toEqual(rules[0].style.circleStrokeColor);
        expect(style[1]).toBeInstanceOf(LineStringStyle);
        expect(style[1].getStyle().getStroke()).toBeInstanceOf(Stroke);
        expect(style[1].getStyle().getStroke().getColor()).toEqual(rules[0].style.lineStrokeColor);

        expect(multiLineStyle[0]).toBeInstanceOf(PointStyle);
        // multiLineStringRules[0].style.circleStrokeColor is not defined --> use defaultStrokeColor
        expect(multiLineStyle[0].getStyle().getImage().getStroke().getColor()).toEqual(defaultStrokeColor);
        expect(multiLineStyle[1]).toBeInstanceOf(LineStringStyle);
        expect(multiLineStyle[1].getStyle().getStroke()).toBeInstanceOf(Stroke);
        expect(multiLineStyle[1].getStyle().getStroke().getColor()).toEqual(multiLineStringRules[0].style.lineStrokeColor);
    });
    it("features with more geometries than rules (rules: 1, geometries: 2) should have style for all geometries - 'styleMultiGeomOnlyWithRule' is not set", function () {
        const style = createStyle.getMultiGeometryStyle("MultiLineString", jsonObjects[4], rulesWithOneEntry, isClustered, wfsImgPathFromConfig);

        expect(Array.isArray(style)).toBe(true);
        expect(style.length).toEqual(2);
        expect(style[0].getStyle().getStroke().getColor()).toEqual(rulesWithOneEntry[0].style.lineStrokeColor);
        expect(style[1].getStyle()).toEqual(null);
    });
});

describe("isMultiGeometry", function () {
    it("should return true with multi geometries", function () {
        expect(createStyle.isMultiGeometry("MultiPoint")).toBe(true);
        expect(createStyle.isMultiGeometry("MultiLineString")).toBe(true);
        expect(createStyle.isMultiGeometry("MultiPolygon")).toBe(true);
        expect(createStyle.isMultiGeometry("GeometryCollection")).toBe(true);
        expect(createStyle.isMultiGeometry("Point")).toBe(false);
    });
});

describe("getGeometryStyle", function () {
    it("should return point style with correct settings", function () {
        const style = createStyle.getGeometryStyle(jsonObjects[0], rules, isClustered, wfsImgPathFromConfig);

        expect(style).toBeInstanceOf(PointStyle);
        expect(Array.isArray(style.getStyle().getImage().getStroke().getColor())).toBe(true);
        expect(style.getStyle().getImage().getStroke().getColor()).toEqual(rules[0].style.circleStrokeColor);
    });
    it("should return 'MultiPoint' style with correct settings", function () {
        const style = createStyle.getGeometryStyle(jsonObjects[3], rules, isClustered, wfsImgPathFromConfig);

        expect(Array.isArray(style)).toBe(true);
        expect(style.length).toEqual(2);
        expect(style[0].getStyle().getImage().getStroke().getColor()).toEqual(rules[0].style.circleStrokeColor);
        expect(style[1].getStyle().getImage().getStroke().getColor()).toEqual(rules[0].style.circleStrokeColor);
    });
    it("should return null as style if no rule is found", function () {
        expect(createStyle.getGeometryStyle(jsonObjects[0], [], isClustered, wfsImgPathFromConfig).getStyle()).toBe(null);
    });
});
