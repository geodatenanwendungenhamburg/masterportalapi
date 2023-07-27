import {Select} from "ol/interaction.js";

/**
 * Remove the selected feature.
 * @param {ol/interaction/Select} selectInteraction The select interaction.
 * @param {ol/source} source The vector layer source containing the features to be selected.
 * @returns {void}
 */
function removeSelectedFeature (selectInteraction, source) {
    selectInteraction.on("select", event => {
        source.removeFeature(event.selected[0]);
        event.target.getFeatures().clear();
    });
}

/**
 * Create the select interaction.
 * @param {ol/layer|ol/layer[]} layers The vector layers for select features.
 * @param {ol/events/condition} [condition] The ol condition. Default from ol is "singleClick".
 * @returns {ol/interaction/Select} The select interaction.
 */
function createSelectInteraction (layers, condition) {
    const selectInteraction = new Select({
        condition: condition,
        layers: Array.isArray(layers) ? layers : [layers],
        hitTolerance: 10
    });

    return selectInteraction;
}

export default {
    createSelectInteraction,
    removeSelectedFeature
};
