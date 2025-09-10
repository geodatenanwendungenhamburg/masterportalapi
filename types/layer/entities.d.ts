/**
 * Sets the layers visibility by setting the show attribute at the datasource.
 * @param {boolean} value  if true, the entity will be shown
 * @param {Object} rawLayer  attributes of the layer
 * @param {string} [rawLayer.id] the id of the layer
 * @param {OLCesium} map ol cesium map
 * @returns {void}
 */
export function setVisible(value: boolean, rawLayer: {
    id?: string;
}, map: OLCesium): void;
/**
 * Creates a Cesium.CustomDataSource and adds it to map's dataSources.
 * Iterates over the entities of the raw layer and adds them to dataSource.
 * @param {Object} rawLayer  attributes of the layer
 * @param {string} [rawLayer.id] the id of the layer
 * @param {string} [rawLayer.entities] array of entities to add
 * @param {OLCesium} map ol cesium map
 * @param {function} callback to execute after datasource is added to map and entities are added
 * @returns {*} null or the return-value of the callback
 */
export function createDataSource(rawLayer: {
    id?: string;
    entities?: string;
}, map: OLCesium, callback: Function): any;
/**
 * Creates an entities layer to use in ol-Cesium map.
 * @param {Object} rawLayer layer specification as in services.json
 * @param {string} [rawLayer.id] optional id of the layer, passed to help identification in services.json
 * @param {string} [rawLayer.name] optional name of the layer, passed to help identification in services.json
 * @param {string} [rawLayer.typ] typ of the layer, passed to help identification in services.json
 * @param {Array} [rawLayer.entities] array of entities to add
 * @param {OLCesium} map ol cesium map
 * @returns {Object} layer
 */
export function createLayer(rawLayer: {
    id?: string;
    name?: string;
    typ?: string;
    entities?: any[];
}, map: OLCesium): any;
export class createLayer {
    /**
     * Creates an entities layer to use in ol-Cesium map.
     * @param {Object} rawLayer layer specification as in services.json
     * @param {string} [rawLayer.id] optional id of the layer, passed to help identification in services.json
     * @param {string} [rawLayer.name] optional name of the layer, passed to help identification in services.json
     * @param {string} [rawLayer.typ] typ of the layer, passed to help identification in services.json
     * @param {Array} [rawLayer.entities] array of entities to add
     * @param {OLCesium} map ol cesium map
     * @returns {Object} layer
     */
    constructor(rawLayer: {
        id?: string;
        name?: string;
        typ?: string;
        entities?: any[];
    }, map: OLCesium);
    values: {
        name: string;
        id: string;
        typ: string;
    };
}
/**
 * Returns the value for the given key of the rawlayer.
 * @param {String} key to get the value for
 * @returns {*} the value to the key
 */
export function get(key: string): any;
