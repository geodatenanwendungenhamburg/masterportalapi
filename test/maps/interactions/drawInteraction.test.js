import {Draw} from "ol/interaction.js";
import Feature from "ol/Feature";
import Circle from "ol/geom/Circle";
import VectorSource from "ol/source/Vector";

import drawInteractions, {styleObject} from "../../../src/maps/interactions/drawInteraction";

describe("src/maps/interactions/drawInteraction.js", () => {
    describe("convertUnits", () => {
        it("shold return 1000 for sourceUnit === 'm' and targetUnit === 'm'", () =>{
            const value = 1000,
                sourceUnit = "m",
                targetUnit = "m";

            expect(drawInteractions.convertUnits(value, sourceUnit, targetUnit)).toEqual(1000);
        });

        it("shold return 1000 for sourceUnit === 'm' and targetUnit === 'km'", () =>{
            const value = 1000,
                sourceUnit = "m",
                targetUnit = "km";

            expect(drawInteractions.convertUnits(value, sourceUnit, targetUnit)).toEqual(1);
        });

        it("shold return 1000 for sourceUnit === 'km' and targetUnit === 'm'", () =>{
            const value = 1000,
                sourceUnit = "km",
                targetUnit = "m";

            expect(drawInteractions.convertUnits(value, sourceUnit, targetUnit)).toEqual(1000000);
        });

        it("shold return 1000 for sourceUnit === 'abc' and targetUnit === 'def'", () =>{
            const value = 1000,
                sourceUnit = "abc",
                targetUnit = "def";

            expect(drawInteractions.convertUnits(value, sourceUnit, targetUnit)).toEqual(1000);
        });
    });

    describe("transformMapUnitRadius", () => {
        it("should return the input meter radius in meter ", () => {
            const radius = 100,
                mapProjection = {
                    getUnits: () => "m"
                },
                mapUnitRadius = drawInteractions.transformMapUnitRadius(radius, mapProjection);

            expect(mapUnitRadius).toEqual(100);
        });

        it("should return the input degree radius in meter ", () => {
            const radius = 100,
                mapProjection = {
                    getUnits: () => "degrees"
                },
                mapUnitRadius = drawInteractions.transformMapUnitRadius(radius, mapProjection);

            expect(mapUnitRadius).toEqual(0.0008983152841195215);
        });

        it("should return the radius unchanged for unknown map units", () => {
            const radius = 100,
                mapProjection = {
                    getUnits: () => "ft"
                },
                mapUnitRadius = drawInteractions.transformMapUnitRadius(radius, mapProjection);

            expect(mapUnitRadius).toEqual(100);
        });
    });

    describe("drawInnerCircle", () => {
        it("should set radius for circle feature", () => {
            const feature = new Feature({geometry: new Circle([565826.38, 5934174.40], 10)}),
                mapProjection = {
                    getUnits: () => "m"
                },
                options = {
                    innerRadius: 100,
                    interactive: false,
                    outerRadius: 500
                };

            drawInteractions.drawInnerCircle(feature, mapProjection, options);

            expect(feature.getGeometry().getRadius()).toEqual(100);
        });
    });

    describe("setStyleObject", () => {
        it("should set style object", () => {
            const currentLayout = {
                fillColor: [55, 126, 184],
                fillTransparency: 0,
                strokeColor: [0, 0, 0],
                strokeWidth: 1,
                polygonDash: [4],
                text: "Text",
                textFont: "Arial",
                textFontSize: 10
            };

            drawInteractions.setStyleObject(currentLayout);

            expect(styleObject).toEqual({
                rules: [
                    {
                        style: {
                            circleFillColor: [
                                55,
                                126,
                                184,
                                1
                            ],
                            circleStrokeColor: [
                                0,
                                0,
                                0
                            ],
                            circleStrokeWidth: 1,
                            lineStrokeColor: [
                                0,
                                0,
                                0,
                                1
                            ],
                            lineStrokeWidth: 1,
                            polygonFillColor: [
                                55,
                                126,
                                184,
                                1
                            ],
                            polygonStrokeColor: [
                                0,
                                0,
                                0
                            ],
                            polygonStrokeDash: [4],
                            polygonStrokeDashOffset: undefined,
                            polygonStrokeWidth: 1,
                            text: "Text",
                            textFont: "Arial",
                            textFontSize: 10
                        }
                    }
                ]
            });
        });
    });

    describe("createDrawInteraction", () => {
        it("should create a draw interaction", () => {
            const source = new VectorSource(),
                drawType = "pen",
                drawInteraction = drawInteractions.createDrawInteraction(drawType, source);

            expect(drawInteraction).not.toBeUndefined();
            expect(drawInteraction).not.toBeNull();
            expect(drawInteraction).toBeInstanceOf(Draw);
        });

        it("should return null, if drawType is not supported", () => {
            const source = new VectorSource(),
                drawType = "abc",
                drawInteraction = drawInteractions.createDrawInteraction(drawType, source);

            expect(drawInteraction).not.toBeUndefined();
            expect(drawInteraction).toBeNull();
            expect(drawInteraction).not.toBeInstanceOf(Draw);
        });

        it("should create a draw interaction for writeText", () => {
            const source = new VectorSource(),
                drawInteraction = drawInteractions.createDrawInteraction("writeText", source);

            expect(drawInteraction).not.toBeNull();
            expect(drawInteraction).toBeInstanceOf(Draw);
        });

        it("should create a draw interaction for each supported drawType", () => {
            const source = new VectorSource(),
                supportedTypes = ["box", "circle", "doubleCircle", "line", "pen", "point", "polygon", "writeText", "square"];

            supportedTypes.forEach(type => {
                const interaction = drawInteractions.createDrawInteraction(type, source);

                expect(interaction).not.toBeNull();
                expect(interaction).toBeInstanceOf(Draw);
            });
        });

        it("should create a draw interaction for an image symbol", () => {
            const source = new VectorSource(),
                iconList = [{id: "myIcon", type: "image", value: "/icons/test.svg", scale: 1}],
                drawInteraction = drawInteractions.createDrawInteraction("myIcon", source, iconList);

            expect(drawInteraction).not.toBeNull();
            expect(drawInteraction).toBeInstanceOf(Draw);
        });

        it("should create a draw interaction for a simple_point symbol", () => {
            const source = new VectorSource(),
                iconList = [{id: "myPoint", type: "simple_point", value: "simple_point"}];

            drawInteractions.setStyleObject({
                fillColor: [255, 0, 0],
                fillTransparency: 0,
                strokeColor: [0, 0, 0],
                strokeWidth: 2
            });

            const drawInteraction = drawInteractions.createDrawInteraction("myPoint", source, iconList);

            expect(drawInteraction).not.toBeNull();
            expect(drawInteraction).toBeInstanceOf(Draw);
        });
    });

    describe("drawOuterCircle", () => {
        it("should set the outer radius on the feature and add inner circle to source", () => {
            const source = new VectorSource(),
                feature = new Feature({geometry: new Circle([0, 0], 10)}),
                mapProjection = {getUnits: () => "m"},
                options = {innerRadius: 100, outerRadius: 500, unit: "m"};

            drawInteractions.setStyleObject({
                fillColor: [55, 126, 184],
                fillTransparency: 0,
                strokeColor: [0, 0, 0],
                strokeWidth: 1
            });
            drawInteractions.setStyleObject({
                fillColor: [0, 0, 0],
                fillTransparency: 100,
                strokeColor: [200, 0, 0],
                strokeWidth: 1
            }, true);

            drawInteractions.drawOuterCircle(feature, mapProjection, source, options);

            expect(feature.getGeometry().getRadius()).toEqual(500);
            expect(source.getFeatures().length).toEqual(1);
            expect(source.getFeatures()[0].getGeometry().getRadius()).toEqual(100);
        });
    });

    describe("drawCircle", () => {
        it("should register drawstart listener for non-interactive circle", () => {
            const source = new VectorSource(),
                drawInteraction = drawInteractions.createDrawInteraction("circle", source),
                mapProjection = {getUnits: () => "m"},
                options = {innerRadius: 200, interactive: false, outerRadius: 0, unit: "m"};

            drawInteractions.drawCircle(drawInteraction, "circle", mapProjection, source, options);

            expect(drawInteraction.getListeners("drawstart").length).toBeGreaterThan(0);
        });

        it("should not register additional listener if innerRadius is 0", () => {
            const source = new VectorSource(),
                drawInteraction = drawInteractions.createDrawInteraction("circle", source),
                mapProjection = {getUnits: () => "m"},
                options = {innerRadius: 0, interactive: false, outerRadius: 0, unit: "m"},
                listenersBefore = drawInteraction.getListeners("drawstart")?.length || 0;

            drawInteractions.drawCircle(drawInteraction, "circle", mapProjection, source, options);

            const listenersAfter = drawInteraction.getListeners("drawstart")?.length || 0;

            expect(listenersAfter).toEqual(listenersBefore);
        });
    });

    describe("setStyleObject", () => {
        it("should handle fillTransparency correctly", () => {
            drawInteractions.setStyleObject({
                fillColor: [255, 0, 0],
                fillTransparency: 50,
                strokeColor: [0, 0, 0],
                strokeWidth: 2
            });

            expect(styleObject.rules[0].style.polygonFillColor).toEqual([255, 0, 0, 0.5]);
            expect(styleObject.rules[0].style.lineStrokeColor).toEqual([0, 0, 0, 0.5]);
        });

        it("should use default text values when not provided", () => {
            drawInteractions.setStyleObject({
                fillColor: [0, 0, 0],
                fillTransparency: 0,
                strokeColor: [0, 0, 0],
                strokeWidth: 1
            });

            expect(styleObject.rules[0].style.text).toEqual("Text");
            expect(styleObject.rules[0].style.textFont).toEqual("Arial");
            expect(styleObject.rules[0].style.textFontSize).toEqual(10);
        });

        it("should set outer circle style when outerCircle is true", () => {
            drawInteractions.setStyleObject({
                fillColor: [200, 0, 0],
                fillTransparency: 100,
                strokeColor: [200, 0, 0],
                strokeWidth: 2
            }, true);

            expect(styleObject.rules[0].style.circleStrokeWidth).toEqual(1);
        });
    });

});
