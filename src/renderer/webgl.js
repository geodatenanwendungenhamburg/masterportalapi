import WebGLPointsLayer from "ol/layer/WebGLVector";
import WebGLVectorLayerRenderer from "ol/renderer/webgl/VectorLayer";
import WebGLVectorTileLayerRenderer from "ol/renderer/webgl/VectorTileLayer.js";
import VectorTile from "ol/layer/VectorTile.js";
import VectorLayer from "ol/layer/Layer";
import styleList from "../vectorStyle/styleList";
import {getRulesForFeature} from "../vectorStyle/lib/getRuleForIndex";
import {returnColor} from "../vectorStyle/lib/colorConvertions";
import {asArray} from "ol/color.js";
import {packColor, parseLiteralStyle} from "ol/webgl/styleparser.js";

/**
 * The default style for OpenLayers WebGLPoints class
 * @see https://openlayers.org/en/latest/examples/webgl-points-layer.html
 * @private
 */
const defaultPointStyle = {
        "circle-radius": 10,
        "circle-fill-color": "#006688",
        "circle-rotate-with-view": false,
        "circle-displacement": [0, 0],
        "circle-opacity": 0.6
    },

    defaultPolygonStyle = {
        fillColor: "#006688",
        strokeColor: "#006688",
        strokeWidth: 1,
        opacity: 1
    },

    /** @type {import('ol/style/literal.js').LiteralStyle} */
    style = Object.assign({
        "stroke-color": ["get", "strokeColor"],
        "stroke-width": ["get", "strokeWidth", "number"],
        "fill-color": ["get", "fillColor"],
        "opacity": ["get", "opacity", "number"],
        "size": ["get", "circleSize", "number"]
    }, defaultPointStyle);

/**
 *  Creates a vector layer with custom renderer.
 * @augments VectorLayer
 * @private
 * @implements {WebGLVectorLayerRenderer}
 * @returns {module:ol/layer/VectorLayer} the LocalWebGLLayer with a custom renderer for WebGL styling
 */
export function createVectorLayerRenderer () {
    /**
     * @class LocalWebGLLayer
     * @see https://openlayers.org/en/latest/examples/webgl-vector-layer.html
     * @description the temporary class with a custom renderer to render the vector data with WebGL
     */
    class LocalWebGLLayer extends VectorLayer {
        /**
         * Creates a new renderer that takes the defined style of the new layer as an input.
         * @returns {module:ol/renderer/webgl/WebGLVectorLayerRenderer} the custom renderer
         * @experimental
         */
        createRenderer () {
            return new WebGLVectorLayerRenderer(this, {
                style
            });
        }
    }

    return LocalWebGLLayer;
}

/**
 * Creates a vector tile layer with custom renderer.
 * @augments VectorTile
 * @private
 * @implements {WebGLVectorTileLayerRenderer}
 * @returns {module:ol/layer/VectorTile} the LocalWebGLLayer with a custom renderer for WebGL styling of vectorTile layers.
 */
export function createVectorTileLayerRenderer () {
    /**
     * @class LocalWebGLLayer
     * @see https://openlayers.org/en/latest/examples/webgl-vector-tiles.html
     * @description the temporary class with a custom renderer to render the vectortiles with WebGL
     */
    class LocalWebGLLayer extends VectorTile {

        /**
         * Creates a new renderer that takes the defined style of the new layer as an input.
         * @returns {module:ol/renderer/webgl/WebGLVectorTileLayerRenderer} the custom renderer
         * @experimental
         */
        createRenderer () {
            const result = parseLiteralStyle(style),
                invisible = [255, 255, 255, 0],
                grey = [119, 119, 119, 1];


            return new WebGLVectorTileLayerRenderer(this, {
                style: {
                    fill: {
                        fragment: result.builder.getFillFragmentShader(),
                        vertex: result.builder.getFillVertexShader()
                    },
                    stroke: {
                        fragment: result.builder.getStrokeFragmentShader(),
                        vertex: result.builder.getStrokeVertexShader()
                    },
                    symbol: {
                        fragment: result.builder.getSymbolFragmentShader(),
                        vertex: result.builder.getSymbolVertexShader()
                    },
                    builder: result.builder,
                    attributes: {
                        fillColor: {
                            size: 2,
                            callback: (feature) => {
                                const featureStyle = this.getStyle()(feature, 1);

                                if (featureStyle && featureStyle[0]) {
                                    const color = featureStyle[0]?.getFill()?.getColor();

                                    return packColor(color && typeof color === "string" ? asArray(color) : invisible);
                                }
                                return packColor(grey);
                            }
                        },
                        strokeColor: {
                            size: 2,
                            callback: (feature) => {
                                const featureStyle = this.getStyle()(feature, 1);

                                if (featureStyle && featureStyle[0]) {
                                    const color = featureStyle[0]?.getStroke()?.getColor();

                                    return packColor(color ? asArray(color) : invisible);
                                }
                                return packColor(grey);
                            }
                        },
                        strokeWidth: {
                            size: 1,
                            callback: (feature) => {
                                const featureStyle = this.getStyle()(feature, 1);

                                if (featureStyle && featureStyle[0]) {
                                    const width = featureStyle[0]?.getStroke()?.getWidth();

                                    if (width !== undefined) {
                                        return width > 10 ? width / 10 : 1;/** @todo needs refactoring in later versions  */
                                    }
                                }
                                return 1;
                            }
                        }
                    }
                }
            });
        }
    }

    return LocalWebGLLayer;
}

/**
 * Parses the vectorStyle from style.json to the feature
 * to reduce processing on runtime.
 * Sets properties with style at feature to use by literalSytle of renderer of VectorLayer.
 * @private
 * @param {module:ol/Feature} feature - the feature to check
 * @param {module:Backbone/Model} [styleObject] - (optional) the style model from StyleList
 * @returns {void}
 */
export function formatFeatureStyles (feature, styleObject) {
    let rule;

    if (styleObject) {
        // extract first matching rule only
        rule = getRulesForFeature(styleObject, feature)[0];
    }

    if (rule?.style) {
        feature.styleRule = rule;

        const polygonFillColor = returnColor(rule.style.polygonFillColor, "rgba"),
            circleFillColor = returnColor(rule.style.circleFillColor, "hex"),

            fillColor = polygonFillColor ? polygonFillColor : circleFillColor,
            strokeColor = returnColor(rule.style.polygonStrokeColor || rule.style.lineStrokeColor, "hex"),
            strokeWidth = rule.style.polygonStrokeWidth || rule.style.lineStrokeWidth,
            size = rule.style.circleRadius;

        feature.set("fillColor", fillColor || defaultPolygonStyle.fillColor);
        feature.set("strokeColor", strokeColor || defaultPolygonStyle.strokeColor);
        feature.set("strokeWidth", strokeWidth || defaultPolygonStyle.strokeWidth);
        feature.set("opacity", fillColor ? (rule.style.polygonFillColor || rule.style.circleFillColor)[3] : defaultPolygonStyle.opacity);
        feature.set("circleSize", size || defaultPointStyle["circle-radius"] * 2);
    }
    else {
        feature.set("fillColor", defaultPolygonStyle.fillColor);
        feature.set("strokeColor", defaultPolygonStyle.strokeColor);
        feature.set("strokeWidth", defaultPolygonStyle.strokeWidth);
        feature.set("opacity", defaultPolygonStyle.opacity);
        feature.set("circleSize", defaultPointStyle["circle-radius"] * 2);
    }
}

/**
 * Layouts the geometry coordinates, removes the Z component
 * @deprecated Will be probably removed in release version
 * @private
 * @param {module:ol/Feature} feature - the feature to format
 * @returns {void}
 */
export function formatFeatureGeometry (feature) {
    feature.getGeometry()?.setCoordinates?.(feature.getGeometry().getCoordinates(), "XY");
}

/**
 * Cleans the data by automatically parsing data provided as strings to the accurate data type
 * @todo Extend to Date types
 * @private
 * @param {module:ol/Feature} feature - the feature to format
 * @param {String[]} [excludeTypes=["boolean"]] - types that should not be parsed from strings
 * @returns {void}
 */
export function formatFeatureData (feature, excludeTypes = ["boolean"]) {
    for (const key in feature.getProperties()) {
        const
            valueAsNumber = parseFloat(feature.get(key)),
            valueIsTrue = typeof feature.get(key) === "string" && feature.get(key).toLowerCase() === "true" ? true : undefined,
            valueIsFalse = typeof feature.get(key) === "string" && feature.get(key).toLowerCase() === "false" ? false : undefined;

        if (!isNaN(parseFloat(feature.get(key))) && !excludeTypes?.includes("number")) {
            feature.set(key, valueAsNumber);
        }
        if (valueIsTrue === true && !excludeTypes.includes("boolean")) {
            feature.set(key, valueIsTrue);
        }
        if (valueIsFalse === false && !excludeTypes.includes("boolean")) {
            feature.set(key, valueIsFalse);
        }
    }
}

/**
 * feature transformations called after loading - but not for layer of typ VectortTile
 * called by the layer source loader, binds the instance of the layer model
 * should be called on each source refresh
 * @param {module:ol/Feature[]} features - the features loaded by the layer
 * @param {String} styleId - The layer's styleId
 * @param {String[]} excludeTypesFromParsing - types that should not be parsed from strings, only necessary for webgl
 * @param {Boolean} isPointLayer - whether the layer source should consist only of points (or multi points)
 * @returns {void}
 */
export function afterLoading (features, styleId, excludeTypesFromParsing, isPointLayer) {
    const styleObject = styleList.returnStyleObject(styleId); // load styleModel to extract rules per feature

    if (Array.isArray(features)) {
        features.forEach(feature => {
            /**
             * extract first point from Multipoint
             * @deprecated will probably not be necessary anymore in release version
             * @example An example for that behavior can be found when rendering "Strassenbaumkataster"
             */
            if (isPointLayer && feature.getGeometry().getType() === "MultiPoint") {
                feature.setGeometry(feature.getGeometry().getPoint(0)); // other points in the multi point will be ignored for now
            }
            formatFeatureGeometry(feature); /** @deprecated will propbably not be necessary anymore in release version */
            formatFeatureStyles(feature, styleObject); /** @todo needs refactoring in release version  */
            formatFeatureData(feature, excludeTypesFromParsing); /** Necessary since the WebGLPoints Style Syntax depends on data types (i.e. numbers not as strings) */
        });
    }
}


/**
 * Creates the OL Layer instance, used to rebuild the layer when shown again after layer has been disposed
 * @param {Object} attrs - the attributes of the layer
 * @public
 * @returns {VectorLayer | WebGLPointsLayer} returns the layer instance
 */
export function createLayer (attrs) {
    let LayerConstructor = WebGLPointsLayer;
    const options = {
        id: attrs.id,
        source: attrs.source,
        disableHitDetection: false,
        name: attrs.name,
        typ: attrs.typ,
        gfiAttributes: attrs.gfiAttributes,
        gfiTheme: attrs.gfiTheme,
        hitTolerance: attrs.hitTolerance || 10,
        opacity: attrs.transparency ? (100 - attrs.transparency) / 100 : attrs.opacity,
        renderer: "webgl",
        styleId: attrs.styleId,
        excludeTypesFromParsing: attrs.excludeTypesFromParsing,
        extent: attrs.extent
    };

    /**
     * If the layer consists only of points, use WebGLPointsLayer
     * For advanced styling options
     * @see https://openlayers.org/en/latest/examples/webgl-points-layer.html
     */
    if (attrs.isPointLayer) {
        /**
         * @deprecated
         * @todo will be replaced in the next OL release and incorporated in the WebGLVectorLayerRenderer
         */
        return new LayerConstructor({
            style: attrs.style || defaultPointStyle,
            disableHitDetection: false,
            ...options,
            isPointLayer: true
        });
    }

    if (attrs.typ === "VectorTile") {

        /**
         * use ol/renderer/webgl/WebGLVectorLayerRenderer if not point layer
         * Point styling as quads only
         */
        LayerConstructor = createVectorTileLayerRenderer(attrs);
    }
    else {

        /**
         * use ol/renderer/webgl/WebGLVectorLayerRenderer if not point layer
         * Point styling as quads only
         */
        LayerConstructor = createVectorLayerRenderer(attrs);
    }
    return new LayerConstructor({
        ...options,
        isPointLayer: false
    });
}

export default {
    afterLoading,
    createLayer,
    createVectorLayerRenderer,
    formatFeatureData,
    formatFeatureGeometry,
    formatFeatureStyles
};
