export default FixedOverlaySynchronizer;
/**
 * Represents a FixedOverlaySynchronizer.
 */
declare class FixedOverlaySynchronizer {
    /**
     * This object takes care of one-directional synchronization of
     * Openlayers WMS raster layers to the given Cesium globe. This Synchronizer
     * assumes that the given WMS supports EPSG Code 4326 (WGS84)
     * @param {!ol.Map} map -
     * @param {!Cesium.Scene} scene -
     * @constructor
     * @extends {olcs.AbstractSynchronizer.<Cesium.ImageryLayer>}
     * @api
     * @struct
     */
    constructor(map: ol.Map, scene: Cesium.Scene);
    /**
     * @api
     * @returns {void}
     */
    addOverlays(): void;
}
