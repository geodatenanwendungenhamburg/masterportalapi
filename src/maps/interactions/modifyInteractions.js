import {Modify} from "ol/interaction.js";

/**
 * Create the modify interaction.
 * @param {ol/source} source The vector layer source containing the features to be modified.
 * @returns {ol/interaction/Modify} The modify interaction.
 */
function createModifyInteraction (source) {
    const modifyInteraction = new Modify({
        source: source
    });

    return modifyInteraction;
}

export default {
    createModifyInteraction
};
