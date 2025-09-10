/**
 * Creates an terrain layer to use in ol-Cesium map. Sets the id of the rawlayer to tileset.layerReferenceId.
 * @param {Object} rawLayer - layer specification as in services.json
 * @param {string} [rawLayer.id] - optional id of the layer, passed to help identification in services.json
 * @param {string} [rawLayer.url] - the URL of the Cesium terrain server
 * @param {string} [rawLayer.cesiumTerrainProviderOptions] - see https://cesiumjs.org/Cesium/Build/Documentation/CesiumTerrainProvider.html
 * @returns {void}
 */
export default function Tileset(rawLayer: {
    id?: string;
    url?: string;
    cesiumTerrainProviderOptions?: string;
}): void;
export default class Tileset {
    /**
     * Creates an terrain layer to use in ol-Cesium map. Sets the id of the rawlayer to tileset.layerReferenceId.
     * @param {Object} rawLayer - layer specification as in services.json
     * @param {string} [rawLayer.id] - optional id of the layer, passed to help identification in services.json
     * @param {string} [rawLayer.url] - the URL of the Cesium terrain server
     * @param {string} [rawLayer.cesiumTerrainProviderOptions] - see https://cesiumjs.org/Cesium/Build/Documentation/CesiumTerrainProvider.html
     * @returns {void}
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
        transparency: any;
    };
    tileset: Promise<any>;
    /**
     * Sets the opacity to the tilset.
     * @param {Numbe} opacity the opacity
     * @returns {void}
     */
    setOpacity(opacity: Numbe): void;
    /**
     *
     * @param {boolean} value  if true, terrainProvider is set to map and terrain will be visible
     * @param {OLCesium} map ol cesium map
     * @returns {void}
     */
    setVisible(value: boolean, map: OLCesium): void;
    /**
     * Returns the value for the given key of the rawlayer.
     * @param {String} key to get the value for
     * @returns {*} the value to the key
     */
    get(key: string): any;
}
