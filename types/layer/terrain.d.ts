/**
 * Sets the layers visibility by setting the terrain provider at Cesium scene.
 * @param {boolean} value  if true, terrainProvider is set to map and terrain will be visible
 * @param {Object} rawLayer  attributes of the layer
 * @param {string} [rawLayer.url] - the URL of the Cesium terrain server
 * @param {string} [rawLayer.cesiumTerrainProviderOptions] - see https://cesiumjs.org/Cesium/Build/Documentation/CesiumTerrainProvider.html
 * @param {OLCesium} map ol cesium map
 * @returns {void}
 */
export function setVisible(value: boolean, rawLayer: {
    url?: string;
    cesiumTerrainProviderOptions?: string;
}, map: OLCesium): void;
/**
 * Creates an terrain layer to use in ol-Cesium map.
 * @param {Object} rawLayer - layer specification as in services.json
 * @param {string} [rawLayer.id] - optional id of the layer, passed to help identification in services.json
 * @param {string} [rawLayer.url] - the URL of the Cesium terrain server
 * @param {string} [rawLayer.cesiumTerrainProviderOptions] - see https://cesiumjs.org/Cesium/Build/Documentation/CesiumTerrainProvider.html
 * @returns {Object} layer
 */
export function createLayer(rawLayer: {
    id?: string;
    url?: string;
    cesiumTerrainProviderOptions?: string;
}): any;
export class createLayer {
    /**
     * Creates an terrain layer to use in ol-Cesium map.
     * @param {Object} rawLayer - layer specification as in services.json
     * @param {string} [rawLayer.id] - optional id of the layer, passed to help identification in services.json
     * @param {string} [rawLayer.url] - the URL of the Cesium terrain server
     * @param {string} [rawLayer.cesiumTerrainProviderOptions] - see https://cesiumjs.org/Cesium/Build/Documentation/CesiumTerrainProvider.html
     * @returns {Object} layer
     */
    constructor(rawLayer: {
        id?: string;
        url?: string;
        cesiumTerrainProviderOptions?: string;
    });
    values: {
        name: any;
        id: string;
        typ: any;
    };
}
/**
 * Returns the value for the given key of the rawlayer.
 * @param {String} key to get the value for
 * @returns {*} the value to the key
 */
export function get(key: string): any;
