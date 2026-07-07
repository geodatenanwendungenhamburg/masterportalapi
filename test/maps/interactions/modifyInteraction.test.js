import {Modify} from "ol/interaction.js";
import VectorSource from "ol/source/Vector";

import modifyInteractions from "../../../src/maps/interactions/modifyInteraction";

describe("src/maps/interactions/modifyInteraction.js", () => {
    describe("createModifyInteraction", () => {
        it("should create a modify interaction", () => {
            const source = new VectorSource(),
                modifyInteraction = modifyInteractions.createModifyInteraction(source);

            expect(modifyInteraction).not.toBeUndefined();
            expect(modifyInteraction).not.toBeNull();
            expect(modifyInteraction).toBeInstanceOf(Modify);
        });

        it("should register optional modify callbacks", () => {
            const source = new VectorSource(),
                onModifyStart = jest.fn(),
                onModifyEnd = jest.fn(),
                modifyInteraction = modifyInteractions.createModifyInteraction(source, {
                    onModifyStart,
                    onModifyEnd
                });

            modifyInteraction.dispatchEvent("modifystart");
            modifyInteraction.dispatchEvent("modifyend");

            expect(onModifyStart).toHaveBeenCalledTimes(1);
            expect(onModifyEnd).toHaveBeenCalledTimes(1);
        });

        it("should work with only onModifyEnd provided", () => {
            const source = new VectorSource(),
                onModifyEnd = jest.fn(),
                modifyInteraction = modifyInteractions.createModifyInteraction(source, {
                    onModifyEnd
                });

            modifyInteraction.dispatchEvent("modifyend");

            expect(onModifyEnd).toHaveBeenCalledTimes(1);
        });
    });

});
