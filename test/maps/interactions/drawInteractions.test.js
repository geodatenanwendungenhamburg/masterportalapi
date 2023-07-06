import {Draw} from "ol/interaction.js";
import VectorSource from "ol/source/Vector";

import drawInteractions from "../../../src/maps/interactions/drawInteractions";

describe("src/maps/interactions/drawInteractions.js", () => {
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
