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
export function setCesiumSceneParams(scene: Cesium.Scene, params: any): void;
/**
 * Sets the camera parameters either from config or from an trigger.
 * @param {Object} params - Parameters for setting the camera.
 * @param {Object} map3D - olcs map instance.
 * @param {Cesium} cesium - Cesium instance.
 * @returns {void}
 */
export function setCameraParameter(params: any, map3D: any, cesium: Cesium): void;
/**
 * Creates a 3D-map.
 * @param {object} [settings] The settings for the 3D-map.
 * @param {module:ol/Map~Map} [settings.map2D] The 2D-Map
 * @param {Cesium.JulianDate} [settings.shadowTime] The shadow time in julian date format if undefined olcs default is Cesium.JulianDate.now().
 * @returns {module:OLCesium} the 3d-map
 */
export function createMap(settings?: {
    map2D?: any;
    shadowTime?: Cesium.JulianDate;
}): any;
/**
 * Logic to listen to click events in 3D mode.
 * @param {Object} map3DObject Contains the scene, 3D map and a callback function.
 * @returns {void}
 */
export function handle3DEvents(map3DObject: any): void;
/**
 * Prepares the camera and listens to camera changed events.
 * @param {Cesium.scene} scene Cesium scene.
 * @param {Object} urlParams optional urlParams for camera.
 * @param {Object} config optional configuration parameters.
 * @returns {Cesium.scene.camera} Cesium camera.
 */
export function prepareCamera(scene: Cesium.scene, urlParams: any, config: any): Cesium.scene.camera;
