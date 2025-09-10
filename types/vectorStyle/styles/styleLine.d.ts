export default LineStringStyle;
declare class LineStringStyle extends StyleClass {
    /**
     * @description Class to create ol.style.Style
     * @constructor
     * @class LineStringStyle
     * @extends StyleClass
     * @memberof VectorStyle.Style
     */
    constructor();
    attributes: {
        lineStrokeColor: number[];
        lineStrokeWidth: number;
        lineStrokeCap: string;
        lineStrokeJoin: string;
        lineStrokeDash: any;
        lineStrokeDashOffset: number;
        lineStrokeMiterLimit: number;
    };
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
