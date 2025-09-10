export default CesiumStyle;
declare class CesiumStyle extends StyleClass {
    /**
     * @description Class to create ol.style.Style
     * @constructor
     * @class CesiumStyleMode
     * @extends StyleClass
     * @memberof VectorStyle.Style
     */
    constructor();
    attributes: {
        feature: any;
        isClustered: boolean;
        type: string;
        imagePath: string;
        imageName: string;
        imageWidth: number;
        imageHeight: number;
        imageScale: number;
        imageOffsetX: number;
        imageOffsetY: number;
        imageOffsetXUnit: string;
        imageOffsetYUnit: string;
        circleRadius: number;
        circleFillColor: number[];
        circleStrokeColor: number[];
        circleStrokeWidth: number;
        clusterType: string;
        clusterCircleRadius: number;
        clusterCircleFillColor: number[];
        clusterCircleStrokeColor: number[];
        clusterCircleStrokeWidth: number;
        clusterImageName: string;
        clusterImageWidth: number;
        clusterImageHeight: number;
        clusterImageScale: number;
        clusterImageOffsetX: number;
        clusterImageOffsetY: number;
        circleSegmentsRadius: number;
        circleSegmentsStrokeWidth: number;
        circleSegmentsBackgroundColor: number[];
        scalingValueDefaultColor: number[];
        circleSegmentsGap: number;
        circleBarScalingFactor: number;
        circleBarRadius: number;
        circleBarLineStroke: number;
        circleBarCircleFillColor: number[];
        circleBarCircleStrokeColor: number[];
        circleBarCircleStrokeWidth: number;
        circleBarLineStrokeColor: number[];
        scalingAttribute: string;
        rotation: number;
        rsRadius: number;
        rsRadius2: any;
        rsPoints: number;
        rsFillColor: number[];
        rsStrokeColor: number[];
        rsStrokeWidth: number;
        rsAngle: number;
        rsScale: any;
    };
    conditions: any[];
    /**
     * This function initializes the Linestring Object by setting or overwriting some attributes.
     * @param {ol/feature} rule styling rule of the feature.
     * @returns {void}
     */
    initialize(rule: any): void;
    /**
     * This function returns a style for each feature.
     * @returns {ol/style} - The created style.
     */
    createStyle(): ol;
    /**
     * Creates the cesium tile style conditions.
     * @param {Object} conditions Condition.
     * @param {Object} style Style.
     * @returns {*} - Condition for cesium 3d tile style.
     */
    createCondition(conditions: any, style: any): any;
    /**
     * Creates a cesium condition.
     * @param {*} conditions Conditions.
     * @returns {String[]} - Cesium condition for rule.
     */
    createCesiumConditionForRule(conditions: any): string[];
    /**
     * Setter for attribute "conditions"
     * @param {*} conditions conditions
     * @returns {void}
     */
    setConditions(conditions: any): void;
}
import StyleClass from "./style";
