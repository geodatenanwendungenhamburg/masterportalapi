import {Style, Icon} from "ol/style.js";
import {prepareValue, isObjectPath} from "../../../lib/attributeMapper";

/**
* Returns the rotation value and its corresponding value according to style.json.
* @param {Object} rotation - The rotation object from the style.json
* @param {Object} featureValues - The values object from the feature
* @returns {number} - The rotation value in degrees or radiants.
*/
export function getRotationValue (rotation, featureValues) {
    if (typeof rotation === "object") {
        const {value, isDegree} = rotation;

        if (isObjectPath(value) && featureValues !== undefined) {
            const rotationValueFromService = parseInt(prepareValue(featureValues, value), 10);

            return isDegree ? rotationValueFromService * Math.PI / 180 : rotationValueFromService;
        }
        return isDegree ? parseInt(value, 10) * Math.PI / 180 : parseInt(value, 10);
    }
    return 0;
}

/**
* Creates pointStyle as icon.
* All features get same image.
* @see {@link https://community.cesium.com/t/cors-and-billboard-image/3920/2} crossOrigin: "anonymous", is necessary for the 3D mode.
* @param {Object} attributes - The attributes from the icon
* @param {Object} feature - The feature
* @param {Boolean} isClustered - true if features are clustered
* @returns {ol/style} - The created style.
*/
export function createIconStyle (attributes, feature, isClustered) {
    const showCluster = isClustered && feature.get("features")?.length > 1,
        imageName = showCluster ? attributes.clusterImageName : attributes.imageName,
        imageOffsetX = showCluster ? attributes.clusterImageOffsetY : attributes.imageOffsetX,
        imageOffsetY = showCluster ? attributes.clusterImageOffsetX : attributes.imageOffsetY,
        scale = showCluster ? attributes.clusterImageScale : attributes.imageScale,
        wfsImgPath = attributes.imagePath;
    let iconOptions = {},
        src = imageName;

    if (!imageName.startsWith("https:") && !imageName.startsWith("<svg")) {
        src = wfsImgPath + imageName;
    }
    iconOptions = {
        crossOrigin: "anonymous",
        src: src.startsWith("<svg") ? "data:image/svg+xml;charset=utf-8," + encodeURIComponent(src) : src,
        scale,
        anchor: [parseFloat(imageOffsetX), parseFloat(imageOffsetY)]
    };

    if (!showCluster) {
        iconOptions.anchorXUnits = attributes.imageOffsetXUnit;
        iconOptions.anchorYUnits = attributes.imageOffsetYUnit;
        iconOptions.rotation = feature ? getRotationValue(attributes.rotation, feature.getProperties()) : 0;
    }

    return new Style({
        image: new Icon(iconOptions)
    });
}

/**
 * create Style for SVG
 * @param  {String} svgPath - contains the params to be draw
 * @see {@link https://community.cesium.com/t/cors-and-billboard-image/3920/2} crossOrigin: "anonymous", is necessary for the 3D mode.
 * @return {ol.Style} style
 */
export function createSVGStyle (svgPath) {
    return new Style({
        image: new Icon({
            crossOrigin: "anonymous",
            src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgPath)
        })
    });
}
