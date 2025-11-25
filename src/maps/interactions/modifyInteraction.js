import {Modify} from "ol/interaction.js";

/**
 * Create the modify interaction.
 * @param {ol/source} source The vector layer source containing the features to be modified.
 * @param {Object} options Optional object to register watchers for modification of features.
 * @returns {ol/interaction/Modify} The modify interaction.
 */
function createModifyInteraction (source, options = {}) {
    const modifyInteraction = new Modify({
        source: source
    });

    if (typeof options.onModifyEnd === "function") {
        modifyInteraction.on("modifyend", options.onModifyEnd);
    }
    if (typeof options.onModifyStart === "function") {
        modifyInteraction.on("modifystart", options.onModifyStart);
    }

    return modifyInteraction;
}

export default {
    createModifyInteraction
};
