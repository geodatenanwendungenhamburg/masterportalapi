import StyleClass from "@masterportal/masterportalapi/src/vectorStyle/styles/style";
import {Circle, Fill, Stroke, Style} from "ol/style.js";
import defaultStyle from "@masterportal/masterportalapi/src/vectorStyle/styles/defaultStyles";

class CircleStyle extends StyleClass {
    /**
     * @description Class to create ol.style.Style
     * @constructor
     * @class CircleStyle
     * @extends StyleClass
     * @memberof VectorStyle.Style
     */
    constructor () {
        super();
        this.attributes = {...defaultStyle.circle};
    }

    /**
     * This function initializes the Linestring Object by setting or overwriting some attributes.
     * @param {ol/feature} feature Feature to be styled.
     * @param {object} styles styling properties to overwrite defaults
     * @param {Boolean} isClustered Flag to show if feature is clustered.
     * @returns {void}
     */
    initialize (feature, styles, isClustered) {
        this.setFeature(feature);
        this.setIsClustered(isClustered);
        this.overwriteStyling(styles);
        this.setStyle(this.createStyle());
    }

    /**
     * This function returns a style for each feature.
     * @returns {ol/style/Style} - The created style.
     */
    createStyle () {
        if (this.nullStyle) {
            return null;
        }

        const fill = new Fill({
                color: this.attributes.circleFillColor
            }),
            stroke = new Stroke({
                color: this.attributes.circleStrokeColor,
                width: this.attributes.circleStrokeWidth
            });

        return new Style({
            image: new Circle({
                fill: fill,
                stroke: stroke,
                radius: 0
            }),
            fill: fill,
            stroke: stroke
        });
    }
}

export default CircleStyle;
