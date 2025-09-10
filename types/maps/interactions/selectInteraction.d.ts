declare namespace _default {
    export { createSelectInteraction };
    export { removeSelectedFeature };
}
export default _default;
/**
 * Create the select interaction.
 * @param {ol/layer|ol/layer[]} layers The vector layers for select features.
 * @param {ol/events/condition} [condition] The ol condition. Default from ol is "singleClick".
 * @returns {ol/interaction/Select} The select interaction.
 */
declare function createSelectInteraction(layers: any, condition: any): ol;
/**
 * Remove the selected feature.
 * @param {ol/interaction/Select} selectInteraction The select interaction.
 * @param {ol/source} source The vector layer source containing the features to be selected.
 * @returns {void}
 */
declare function removeSelectedFeature(selectInteraction: any, source: any): void;
