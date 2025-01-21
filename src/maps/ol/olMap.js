import {Map} from "ol";
import {DragPan, defaults as olDefaultInteractions} from "ol/interaction.js";
import setBackgroundImage from "../../lib/setBackgroundImage";
import getInitialLayers from "../../lib/getInitialLayers";
import defaults from "../../defaults";
import * as wms from "../../layer/wms";
import wmts from "../../layer/wmts";
import * as geojson from "../../layer/geojson";
import wfs from "../../layer/wfs";
import * as vectortile from "../../layer/vectorTile";
import oaf from "../../layer/oaf";
import {createMapView} from "../../maps/mapView";
import rawLayerList from "../../rawLayerList";
import crs from "../../crs";
import {setGazetteerUrl} from "../../searchAddress";

let mapIdCounter = 0;

/**
 * lookup for layer constructors
 * @ignore
 */
const layerBuilderMap = {
        wms,
        "wmts": wmts,
        wfs,
        geojson,
        vectortile,
        oaf
    },
    originalAddLayer = Map.prototype.addLayer;

/**
 * Flattens a Layer/LayerGroup to an array of non-group instances.
 * @param {ol/layer/Base} layer any layer, possibly a LayerGroup
 * @returns {ol/layer/Base[]} array of all given layers
 */
function flattenLayerGroups (layer) {
    return layer.getLayers
        ? layer
            .getLayers()
            .getArray()
            .map(l => flattenLayerGroups(l))
            .flat(1)
        : [layer];
}

/**
 * Adds an error handling function to an arbitrary layer. The event will be
 * registered to the tileloaderror, imageloaderror, featuresloaderror, and
 * generic error event. Depending on the type of layer and error, only one of
 * these events will fire.
 * @param {ol/layer/Base} layer Any type of layer implemented.
 * @param {Function} errorCallback Error callback, called from OL event.
 * @returns {void} side-effect to layer
 */
function injectErrorCallback (layer, errorCallback) {
    const layers = flattenLayerGroups(layer);

    layers.forEach(l => {
        const source = l.getSource?.();

        if (source) {
            source.on?.("tileloaderror", errorCallback);
            source.on?.("imageloaderror", errorCallback);
            source.on?.("featuresloaderror", errorCallback);
            source.on?.("error", errorCallback);
        }
        else {
            console.error("Could not register error callback on layer:", l);
        }
    });
}

/**
 * Adds a layer to the map, or adds a layer to the map by id.
 * This id is looked up within the array of all known services.
 *
 * Make sure services have been loaded with a callback on createMap
 * if you request the services from the internet.
 *
 * This function is available on all ol/Map instances.
 * @param {(string|ol/layer/Base)} layerOrId - if of layer to add to map
 * @param {object} [params] - optional parameter object
 * @param {boolean} [params.layerParams={}] - additional layerParams specified in portalConfig
 * @param {boolean} [params.layerParams.visibility=true] - if params.visibility not given, this is used
 * @param {Number} [params.layerParams.transparency=0] - if params.transparency not given, this is used
 * @param {boolean} [params.visibility=params.layerParams.visibility] - whether added layer is initially visible
 * @param {Number} [params.transparency=params.layerParams.transparency] - how visible the layer is initially
 * @param {Function} [params.errorCallback=console.error] - callback for layer source error events
 * @returns {?ol.Layer} added layer
 */
function addLayer (layerOrId, params) {
    const visibility = params?.visibility ?? params?.layerParams?.visibility ?? true,
        transparency = params?.transparency ?? params?.layerParams?.transparency ?? 0,
        layerParams = {...params?.layerParams || {}, visibility, transparency},
        errorCallback = typeof params?.errorCallback === "function"
            ? params?.errorCallback
            : console.error;
    let layer, layerBuilder;

    // if parameter is id, create and add layer with masterportalAPI mechanisms
    if (typeof layerOrId === "string") {
        const rawLayer = rawLayerList.getLayerWhere({id: layerOrId});

        if (!rawLayer) {
            console.error("Layer with id '" + layerOrId + "' not found. No layer added to map.");
            return null;
        }
        layerBuilder = layerBuilderMap[rawLayer.typ.toLowerCase()];
        if (!layerBuilder) {
            console.error("Layer with id '" + layerOrId + "' has unknown type '" + rawLayer.typ + "'. No layer added to map.");
            return null;
        }
        layer = layerBuilder.createLayer(rawLayer, {layerParams}, {map: this});
        layer.setVisible(typeof visibility === "boolean" ? visibility : true);
        layer.setOpacity(typeof transparency === "number" ? (100 - transparency) / 100 : 1);
        injectErrorCallback(layer, errorCallback);
        originalAddLayer.call(this, layer);
        return layer;
    }

    // else use original function
    injectErrorCallback(layerOrId, errorCallback);
    return originalAddLayer.call(this, layerOrId);
}

Map.prototype.addLayer = addLayer;

/**
 * Creates an openlayers map according to configuration. Does not set many default values itself, but uses function that do.
 * Check the called functions for default values, or [the defaults file]{@link ./defaults.js}.
 * @param {object} [config] - configuration object - falls back to defaults if none given
 * @param {string} [config.target="map"] - div id to render map to
 * @param {string} [config.namedProjections] - projections to create the map
 * @param {string} [config.backgroundImage] - background image for map; "" to use none
 * @param {string} [config.epsg] - CRS to use
 * @param {number[]} [config.extent] - extent to use
 * @param {Array.<{resolution: number, scale: number, zoomLevel: number}>} [config.options] - zoom level definition
 * @param {Array.<string[]>} [config.options] - each sub-array has two values: projection name, and projection description
 * @param {number} [config.startResolution] - initial resolution
 * @param {number[]} [config.startCenter] - initial position
 * @param {(string|object)} [config.layerConf] - services registry or URL thereof
 * @param {string} [config.gazetteerUrl] - url of gazetteer to use in searchAddress
 * @param {object}  [settings={}] - setings object
 * @param {object} [settings.mapParams] - additional parameter object that is spread into the ol.Map constructor object
 * @param {function} [settings.callback] - optional callback for layer list loading
 * @param {function} [settings.errorCallback] – method called on error events
 * @param {String} [mapMode = "2D"] The map mode. '2D' to craete a 2D-map and '3D' to create a 3D-map.
 * @returns {object} map object from ol
 */
export function createMap (config = defaults, {mapParams, callback, errorCallback} = {}) {
    crs.registerProjections(config.namedProjections);
    setBackgroundImage(config);
    setGazetteerUrl(config.gazetteerUrl);

    const selectedInteractions = Object.assign({}, {dragPan: false, altShiftDragRotate: false, pinchRotate: false}, config.mapInteractions?.interactionModes),
        map = new Map(Object.assign({
            target: config.target || defaults.target,
            interactions: olDefaultInteractions(selectedInteractions).extend([
                new DragPan({
                    condition: function (event) {
                        if (event.originalEvent.shiftKey) {
                            return false;
                        }
                        return (!event.originalEvent.pointerType || event.originalEvent.pointerType === "mouse") || (config.mapInteractions?.interactionModes?.twoFingerPan && this.getPointerCount() === 2) || !config.mapInteractions?.interactionModes?.twoFingerPan;
                    }
                })
            ]),
            controls: [],
            view: createMapView(config),
            keyboardEventTarget: config.mapInteractions?.keyboardEventTarget ? document : false
        }, mapParams));

    map.set("mapMode", "2D");
    map.set("id", `map2D_${mapIdCounter++}`);

    // extend callback to load configured initial layers
    rawLayerList.initializeLayerList(config.layerConf, (param, error) => {
        getInitialLayers(config)
            .forEach(layer => {
                map.addLayer(layer.id, {layerParams: layer, errorCallback});
            });

        if (typeof callback === "function") {
            return callback(param, error);
        }

        return null;
    });

    return map;
}
