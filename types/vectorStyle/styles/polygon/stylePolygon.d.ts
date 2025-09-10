export default PolygonStyle;
declare class PolygonStyle extends StyleClass {
    /**
     * @description Class to create ol.style.Style
     * @constructor
     * @class PolygonStyle
     * @extends StyleClass
     * @memberof VectorStyle.Style
     */
    constructor();
    attributes: {
        polygonStrokeColor: number[];
        polygonStrokeWidth: number;
        polygonStrokeCap: string;
        polygonStrokeJoin: string;
        polygonStrokeDash: any;
        polygonStrokeDashOffset: number;
        polygonStrokeMiterLimit: number;
        polygonFillColor: number[];
        polygonFillHatch: any;
    };
    /**
     * This function initializes the stylePolygon Object by setting or overwriting some attributes.
     * @param {ol/feature} feature Feature to be styled.
     * @param {object} styles styling properties to overwrite defaults
     * @param {Boolean} isClustered Flag to show if feature is clustered.
     * @returns {void}
     */
    initialize(feature: any, styles: object, isClustered: boolean): void;
    /**
     * This function returns a style for each feature.
     * @returns {ol/style} - The created style.
     */
    createStyle(): ol;
    /**
     * Generates a polygon fill pattern.
     * @param {object} params parameters as defined in style.json.md#Polygon.polygonFillHatch
     * @returns {HTMLCanvasElement} contains polygon fill pattern
     */
    getPolygonFillHatch({ pattern, size, lineWidth, backgroundColor, patternColor }: object): HTMLCanvasElement;
    getPolygonFillHatchLegendDataUrl(style: any): string;
}
import StyleClass from "../style";
