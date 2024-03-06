import {Circle as CircleStyle, Fill, Stroke, Style} from "ol/style.js";
import {returnColor} from "../../lib/colorConvertions";

/**
* Creates pointStyle as circle.
* all features get same circle.
* @param {Object} attributes - The attributes from the circle
* @param {Object} feature - The feature
* @param {Boolean} isClustered - true if features are clustered
* @returns {ol/style} - The created style.
*/
export function createCircleStyle (attributes, feature, isClustered) {
    const showCluster = isClustered && feature.get("features")?.length > 1,
        radius = showCluster ? parseFloat(attributes.clusterCircleRadius, 10) : parseFloat(attributes.circleRadius, 10),
        fillcolor = showCluster ? returnColor(attributes.clusterCircleFillColor, "rgb") : returnColor(attributes.circleFillColor, "rgb"),
        strokecolor = showCluster ? returnColor(attributes.clusterCircleStrokeColor, "rgb") : returnColor(attributes.circleStrokeColor, "rgb"),
        strokewidth = showCluster ? parseFloat(attributes.clusterCircleStrokeWidth, 10) : parseFloat(attributes.circleStrokeWidth, 10);

    return new Style({
        image: new CircleStyle({
            radius: radius,
            fill: new Fill({
                color: fillcolor
            }),
            stroke: new Stroke({
                color: strokecolor,
                width: strokewidth
            })
        }),
        zIndex: -1
    });
}