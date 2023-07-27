/* eslint-disable no-underscore-dangle */
import {pointerMove, singleClick} from "ol/events/condition.js";
import {Select} from "ol/interaction.js";
import VectorLayer from "ol/layer/Vector";

import selectInteractions from "../../../src/maps/interactions/selectInteraction";

describe("src/maps/interactions/selectInteraction.js", () => {
    describe("createSelectInteraction", () => {
        it("should create a select interaction", () => {
            const layers = new VectorLayer(),
                selectInteraction = selectInteractions.createSelectInteraction(layers);

            expect(selectInteraction).not.toBeUndefined();
            expect(selectInteraction).not.toBeNull();
            expect(selectInteraction).toBeInstanceOf(Select);
            expect(selectInteraction.condition_).toEqual(singleClick);
        });

        it("should create a select interaction with condition === pointerMove", () => {
            const layers = new VectorLayer(),
                selectInteraction = selectInteractions.createSelectInteraction(layers, pointerMove);

            expect(selectInteraction).not.toBeUndefined();
            expect(selectInteraction).not.toBeNull();
            expect(selectInteraction).toBeInstanceOf(Select);
            expect(selectInteraction.condition_).toEqual(pointerMove);
        });
    });

});
