export default PointStyle;
declare class PointStyle extends StyleClass {
    /**
     * @description Class to create ol.style.Style
     * @constructor
     * @class PointStyle
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
    /**
     * This function initializes the Linestring Object by setting or overwriting some attributes.
     * @param {ol/feature} feature Feature to be styled.
     * @param {object} styles styling properties to overwrite defaults
     * @param {Boolean} isClustered Flag to show if feature is clustered.
     * @param {Boolean} wfsImgPathFromConfig image Path of the wfs.
     * @returns {void}
     */
    initialize(feature: any, styles: object, isClustered: boolean, wfsImgPathFromConfig: boolean): void;
    /**
     * This function returns a style for each feature.
     * @returns {ol/style} - The created style.
     */
    createStyle(): ol;
    /**
     * Setter for circleSegmentsBackgroundColor
     * @param {Number[]} value Color
     * @returns {void}
     */
    setCircleSegmentsBackgroundColor(value: number[]): void;
    /**
     * Setter for size.
     * @param {*} value Size
     * @returns {void}
     */
    setSize(value: any): void;
    size: any;
    /**
     * Getter for size.
     * @param {*} size Size
     * @returns {void}
     */
    getSize(): void;
    /**
     * Setter for imagePath.
     * @param {String} value Image path.
     * @returns {void}
     */
    setImagePath(value: string): void;
}
import StyleClass from "../style";
