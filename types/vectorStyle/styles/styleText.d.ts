export default TextStyle;
declare class TextStyle extends StyleClass {
    /**
     * @description Class to create ol.style/Text
     * @class TextStyle
     * @constructor
     * @extends StyleClass
     * @memberof VectorStyle.Style
     */
    constructor();
    attributes: {
        textAlign: string;
        textFont: string;
        textScale: number;
        textOffsetX: number;
        textOffsetY: number;
        textFillColor: number[];
        textStrokeColor: number[];
        textStrokeWidth: number;
        labelField: string;
        textSuffix: string;
        rotation: number;
        clusterTextType: string;
        clusterText: string;
        clusterTextAlign: string;
        clusterTextFont: string;
        clusterTextScale: number;
        clusterTextOffsetX: number;
        clusterTextOffsetY: number;
        clusterTextFillColor: number[];
        clusterTextStrokeColor: number[];
        clusterTextStrokeWidth: number;
    };
    /**
    * This function initializes the styleText Object by setting or overwriting some attributes.
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
     * Returns the rotation value and its corresponding value according to style.json.
     * @param {Object} rotation - The rotation object from the style.json
     * @param {Object} featureValues - The values object from the feature
     * @returns {number} - The rotation value in degrees or radiants.
     */
    getRotationValue(rotation: any, featureValues: any): number;
    /**
    * Creates text style for clustered features. The text attribute is set according to "clusterTextType".
    * "clusterTextType" === "counter" sets the number of clustered features.
    * "clusterTextType" === "text" sets the value of "clusterText" or "undefined".
    * @returns {ol/style/Text} - The created style.
    */
    createClusteredTextStyle(): ol;
    /**
    * Creates text style for simple features. The text attribute is set using "labelField".
    * @returns {ol/style/Text} - The created style.
    */
    createLabeledTextStyle(): ol;
}
import StyleClass from "./style";
