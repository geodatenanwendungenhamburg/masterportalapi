import {Draw} from "ol/interaction.js";

import drawInteractions from "../../../src/maps/interactions/drawInteractions";

describe("src/maps/interactions/drawInteractions.js", () => {
    describe("createInteractiveOrStaticDrawInteraction", () => {
        it("should create a interactive or static draw interaction", () => {
            const drawType = "pen",
                source = "",
                mapProjection = {
                    getUnits: () => "m"
                },
                options = {},
                drawInteraction = drawInteractions.createInteractiveOrStaticDrawInteraction(drawType, source, mapProjection, options);

            expect(drawInteraction).not.toBeUndefined();
            expect(drawInteraction).not.toBeNull();
            expect(drawInteraction).toBeInstanceOf(Draw);
        });
    });

    describe("createDrawInteraction", () => {
        it("should create a draw interaction", () => {
            const source = "",
                type = "Point",
                drawTypeOptions = {},
                drawInteraction = drawInteractions.createDrawInteraction(source, type, drawTypeOptions);

            expect(drawInteraction).not.toBeUndefined();
            expect(drawInteraction).not.toBeNull();
            expect(drawInteraction).toBeInstanceOf(Draw);
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
});
