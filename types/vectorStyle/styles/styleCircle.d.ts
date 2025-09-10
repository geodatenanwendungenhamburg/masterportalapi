export default CircleStyle;
declare class CircleStyle extends StyleClass {
    /**
     * @description Class to create ol.style.Style
     * @constructor
     * @class CircleStyle
     * @extends StyleClass
     * @memberof VectorStyle.Style
     */
    constructor();
    attributes: any;
    /**
     * This function initializes the Linestring Object by setting or overwriting some attributes.
     * @param {ol/feature} feature Feature to be styled.
     * @param {object} styles styling properties to overwrite defaults
     * @param {Boolean} isClustered Flag to show if feature is clustered.
     * @returns {void}
     */
    initialize(feature: any, styles: object, isClustered: boolean): void;
    /**
     * This function returns a style for each feature.
     * @returns {ol/style/Style} - The created style.
     */
    createStyle(): ol;
}
import StyleClass from "./style";
