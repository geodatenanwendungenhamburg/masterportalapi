import OLCesium from "olcs";
import {transform, get} from "ol/proj.js";
import VectorSynchronizer from "olcs/lib/olcs/VectorSynchronizer.js";

import FixedOverlaySynchronizer from "./3dUtils/fixedOverlaySynchronizer.js";
import WMSRasterSynchronizer from "./3dUtils/wmsRasterSynchronizer.js";
import defaults from "../../defaults";

let mapIdCounter = 0;

/**
 * Recursively sets parameters on the Cesium scene.
 *
 * Certain keys are excluded from being set directly on the scene object:
 * - "0", "1", "2": These is placeholder keys or indices from certain configurations that should not be interpreted as scene properties.
 * - "heading", "tilt", "altitude": These are camera-related properties and should be handled separately via specific camera functions.
 *
 * @param {Cesium.Scene} scene - The Cesium scene instance.
 * @param {Object} params - Configuration parameters.
 * @returns {void}
 */
export function setCesiumSceneParams (scene, params) {
    if (!scene || !params || typeof params !== "object") {
        console.warn("setCesiumSceneParams: Invalid scene or params.");
        return;
    }

    Object.entries(params).forEach(([key, value]) => {
        if (["0", "1", "2", "heading", "tilt", "altitude", "pitch"].includes(key)) {
            return;
        }

        if (typeof value === "object" && scene[key]) {
            setCesiumSceneParams(scene[key], value);
        }
        else {
            scene[key] = value;
        }
    });
}
/**
 * Sets the camera parameters either from config or from an trigger.
 * @param {Object} params - Parameters for setting the camera.
 * @param {Object} map3D - olcs map instance.
 * @param {Cesium} cesium - Cesium instance.
 * @returns {void}
 */
export function setCameraParameter (params, map3D, cesium) {
    if (!params || !map3D) {
        console.warn("setCameraParameter: Missing parameters or map3D instance.");
        return;
    }

    let camera = map3D.getCesiumScene()?.camera;
    const heading = parseFloat(params.heading ?? params.camera?.heading ?? 0),
        pitch = parseFloat(params.pitch ?? params.camera?.pitch ?? 0),
        roll = parseFloat(params.roll ?? 0),
        tilt = parseFloat(params.tilt ?? params.camera?.tilt ?? 0),
        altitude = parseFloat(params.altitude ?? params.camera?.altitude ?? 0);

    if (params.cameraPosition || params.camera?.cameraPosition) {
        const cameraPosition = params.cameraPosition ?? params.camera.cameraPosition,
            destination = cesium.Cartesian3.fromDegrees(cameraPosition[0], cameraPosition[1], cameraPosition[2]),
            orientation = {
                heading: cesium.Math.toRadians(heading),
                pitch: cesium.Math.toRadians(pitch),
                roll: cesium.Math.toRadians(roll)
            };

        if (params.cameraPosition) {
            camera.setView({destination, orientation});
        }
        else {
            camera.flyTo({destination, orientation});
        }

        return;
    }

    camera = map3D.getCamera();

    if (tilt) {
        camera.setTilt(tilt);
    }
    if (heading) {
        camera.setHeading(heading);
    }
    if (altitude) {
        camera.setAltitude(altitude);
    }
}

/**
 * Creates a 3D-map.
 * @param {object} [settings] The settings for the 3D-map.
 * @param {module:ol/Map~Map} [settings.map2D] The 2D-Map
 * @param {Cesium.JulianDate} [settings.shadowTime] The shadow time in julian date format if undefined olcs default is Cesium.JulianDate.now().
 * @returns {module:OLCesium} the 3d-map
 */
export function createMap (settings) {
    const map3D = new OLCesium({
        map: settings.map2D,
        time: settings?.shadowTime,
        stopOpenLayersEventsPropagation: true,
        createSynchronizers: (olMap, scene) => {
            return [new WMSRasterSynchronizer(olMap, scene), new VectorSynchronizer(olMap, scene), new FixedOverlaySynchronizer(olMap, scene)];
        }
    });

    map3D.id = `map3D_${mapIdCounter++}`;
    map3D.mapMode = "3D";

    setCesiumSceneParams(map3D.getCesiumScene(), defaults.sceneOptions);
    if (settings?.cesiumParameter) {
        setCesiumSceneParams(map3D.getCesiumScene(), settings.cesiumParameter);
        setCameraParameter(settings.cesiumParameter, map3D, Cesium);
    }

    return map3D;
}

/**
 * Reacts to 3D click event in cesium scene.
 * @param {Event} event The cesium event.
 * @returns {Function} Returns the callbackfunction with click informations.
 */
function reactTo3DClickEvent (event) {
    const scene = this.scene,
        ray = scene.camera.getPickRay(event.position),
        cartesian = scene.globe.pick(ray, scene),
        mapProjection = this.map3D.getOlView().getProjection();
    let height,
        coords,
        cartographic,
        distance,
        resolution,
        transformedCoords,
        transformedPickedPosition,
        pickedPositionCartesian,
        cartographicPickedPosition,
        clickObject;

    if (cartesian) {
        if (document.querySelector(".nav li")?.classList.contains("open")) {
            document.querySelector(".nav li").classList.remove("open");
        }
        cartographic = scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        coords = [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];
        height = scene.globe.getHeight(cartographic);
        if (height) {
            coords = coords.concat([height]);
        }

        distance = Cesium.Cartesian3.distance(cartesian, scene.camera.position);
        resolution = this.map3D.getCamera().calcResolutionForDistance(distance, cartographic.latitude);
        transformedCoords = transform(coords, get("EPSG:4326"), mapProjection);
        transformedPickedPosition = null;

        if (scene.pickPositionSupported) {
            const pickedObject = scene.pick(event.position);

            pickedPositionCartesian = scene.pickPosition(event.position);

            if (!pickedPositionCartesian && pickedObject?.primitive instanceof window.Cesium.Billboard) {
                pickedPositionCartesian = pickedObject.primitive?.position;
            }

            if (pickedPositionCartesian) {
                cartographicPickedPosition = scene.globe.ellipsoid.cartesianToCartographic(pickedPositionCartesian);
                transformedPickedPosition = transform([Cesium.Math.toDegrees(cartographicPickedPosition.longitude), Cesium.Math.toDegrees(cartographicPickedPosition.latitude)], get("EPSG:4326"), mapProjection);
                transformedPickedPosition.push(cartographicPickedPosition.height);
            }
        }
        clickObject = {
            map3D: this,
            position: event.position,
            pickedPosition: transformedPickedPosition,
            coordinate: transformedCoords,
            latitude: coords[0],
            longitude: coords[1],
            resolution: resolution,
            originalEvent: event
        };
    }
    return this.callback(clickObject);
}

/**
 * Logic to listen to click events in 3D mode.
 * @param {Object} map3DObject Contains the scene, 3D map and a callback function.
 * @returns {void}
 */
export function handle3DEvents (map3DObject) {
    let eventHandler;

    if (Cesium) {
        eventHandler = new Cesium.ScreenSpaceEventHandler(map3DObject.scene.canvas);
        eventHandler.setInputAction(reactTo3DClickEvent.bind(map3DObject), Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
}

/**
 * Prepares the camera and listens to camera changed events.
 * @param {Cesium.scene} scene Cesium scene.
 * @param {Object} urlParams optional urlParams for camera.
 * @param {Object} config optional configuration parameters.
 * @returns {Cesium.scene.camera} Cesium camera.
 */
export function prepareCamera (scene, urlParams, config) {
    const camera = scene.camera;
    let cameraParameter = Object.prototype.hasOwnProperty.call(config, "cameraParameter") ? config.cameraParameter : {};

    cameraParameter = urlParams?.altitude ? Object.assign(cameraParameter || {}, {altitude: urlParams?.altitude}) : cameraParameter;
    cameraParameter = urlParams?.heading ? Object.assign(cameraParameter || {}, {heading: urlParams?.heading}) : cameraParameter;
    cameraParameter = urlParams?.tilt ? Object.assign(cameraParameter || {}, {tilt: urlParams?.tilt}) : cameraParameter;

    if (Object.keys(cameraParameter).length > 0) {
        setCesiumSceneParams(scene, {camera: cameraParameter});
    }

    return camera;
}
