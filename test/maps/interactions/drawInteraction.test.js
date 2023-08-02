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
                strokeWidth: 1
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
                                0
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
                            polygonStrokeWidth: 1
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
    });

});
