import {Modify} from "ol/interaction.js";
import VectorSource from "ol/source/Vector";

import modifyInteractions from "../../../src/maps/interactions/modifyInteractions";

describe("src/maps/interactions/modifyInteractions.js", () => {
    describe("createModifyInteraction", () => {
        it("should create a modify interaction", () => {
            const source = new VectorSource(),
                modifyInteraction = modifyInteractions.createModifyInteraction(source);

            expect(modifyInteraction).not.toBeUndefined();
            expect(modifyInteraction).not.toBeNull();
            expect(modifyInteraction).toBeInstanceOf(Modify);
        });
    });

});
