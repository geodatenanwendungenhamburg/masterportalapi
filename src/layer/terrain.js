/**
 * Creates a terrain provider with the cesiumTerrainProviderOptions, if not exists.
 * @param {Object} rawLayer  attributes of the layer
 * @param {string} [rawLayer.url] - the URL of the Cesium terrain server
 * @param {string} [rawLayer.cesiumTerrainProviderOptions] - see https://cesiumjs.org/Cesium/Build/Documentation/CesiumTerrainProvider.html
 * @returns {Promise<Cesium.CesiumTerrainProvider>} the terrain provider
 */
async function createTerrainProvider (rawLayer) {
    const options = {};
    let terrainProvider = "";

    if (rawLayer.cesiumTerrainProviderOptions) {
        Object.assign(options, rawLayer.cesiumTerrainProviderOptions);
    }
    terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(rawLayer.url, options);

    return terrainProvider;
}


/**
 * Creates an terrain layer to use in ol-Cesium map.
 * @param {Object} rawLayer - layer specification as in services.json
 * @param {string} [rawLayer.id] - optional id of the layer, passed to help identification in services.json
 * @param {string} [rawLayer.url] - the URL of the Cesium terrain server
 * @param {string} [rawLayer.cesiumTerrainProviderOptions] - see https://cesiumjs.org/Cesium/Build/Documentation/CesiumTerrainProvider.html
 * @returns {Object} layer
 */
export function createLayer (rawLayer) {
    const layer = {
        values: {
            name: rawLayer.name,
            id: rawLayer.id,
            typ: rawLayer.typ
        },
        /**
         * Returns the value for the given key of the rawlayer.
         * @param {String} key to get the value for
         * @returns {*} the value to the key
         */
        get (key) {
            return this.values?.[key];
        },
        /**
         * Sets the layers visibility by setting the terrain provider at Cesium scene.
         * @param {boolean} value  if true, terrainProvider is set to map and terrain will be visible
         * @param {Object} layerAttributes  attributes of the layer - the raw layer
         * @param {string} [layerAttributes.url] - the URL of the Cesium terrain server
         * @param {Object} [layerAttributes.cesiumTerrainProviderOptions] - see https://cesiumjs.org/Cesium/Build/Documentation/CesiumTerrainProvider.html
         * @param {OLCesium} map ol cesium map
         * @returns {void}
         */
        async setVisible (value, layerAttributes, map) {
            if (map && typeof map.getCesiumScene === "function") {
                if (value) {
                    map.getCesiumScene().terrainProvider = await createTerrainProvider(layerAttributes);
                }
                else {
                    map.getCesiumScene().terrainProvider = new Cesium.EllipsoidTerrainProvider({});
                }
            }
        }
    };

    return layer;
}

