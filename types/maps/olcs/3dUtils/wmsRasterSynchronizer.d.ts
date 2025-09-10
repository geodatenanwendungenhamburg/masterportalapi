export default WMSRasterSynchronizer;
/**
 * Represents a WMSRasterSynchronizer.
 */
declare class WMSRasterSynchronizer {
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
     * @type {!Cesium.ImageryLayerCollection}
     * @private
     */
    private cesiumLayers;
    /**
     * @type {!Cesium.ImageryLayerCollection}
     * @private
     */
    private ourLayers;
    /**
     * @inheritDoc
     */
    addCesiumObject(object: any): void;
    /**
     * @inheritDoc
     */
    destroyCesiumObject(object: any): void;
    /**
     * @inheritDoc
     */
    removeSingleCesiumObject(object: any, destroy: any): void;
    /**
     * @inheritDoc
     */
    removeAllCesiumObjects(destroy: any): void;
    /**
     * Creates an array of Cesium.ImageryLayer.
     * May be overriden by child classes to implement custom behavior.
     * The default implementation handles tiled imageries in EPSG:4326 or
     * EPSG:3859.
     * @param {module:ol/layer/Base~BaseLayer } olLayer The raster layer.
     * @param {module:ol/proj} viewProj Projection of the view.
     * @return {?Array.<!Cesium.ImageryLayer>} Array or null if not possible.
     * (or supported)
     * @protected
     */
    protected convertLayerToCesiumImageries(olLayer: any, viewProj: any): Array<Cesium.ImageryLayer> | null;
    /**
     * Creates an Cesium.WebMapServiceImageryProvider for RasterLayer of the type TileWMS.
     * @param {module:ol/source/TileWMS} source The raster layer source.
     * @param {module:ol/proj} viewProj Projection of the view.
     * @param {module:ol/layer/Base~BaseLayer } olLayer The raster layer.
     * @returns {WebMapServiceImageryProvider} The imagery provider.
     */
    createProviderForTileWMS(source: any, viewProj: any, olLayer: any): WebMapServiceImageryProvider;
    /**
     * Creates an Cesium.ImageryLayer for RasterLayer of the type ImageWMS.
     * @param {module:ol/layer/Base~BaseLayer } olLayer The raster layer.
     * @param {module:ol/proj} viewProj Projection of the view.
     * @returns {Cesium.ImageryLayer} The imagery layer.
     */
    createImageryLayerForImageWMS(olLayer: any, viewProj: any): Cesium.ImageryLayer;
    /**
     * Creates an Cesium.SingleTileImageryProvider for RasterLayer of the type StaticImageSource.
     * @param {module:ol/source/ImageStatic} source The raster layer source.
     * @returns {SingleTileImageryProvider} The imagery provider.
     */
    createProviderForStaticImageSource(source: any): SingleTileImageryProvider;
    /**
     *
     * @param {ol.Extent} extent -
     * @param {ol.ProjectionLike} projection -
     * @return {Array.<Cesium.Cartographic>} -
     * @private
     */
    private getExtentPoints;
    /**
     *
     * @param {ol.tilegrid.TileGrid} tilegrid -
     * @param {ol.Extent} extent -
     * @param {ol.ProjectionLike} projection -
     * @return {Array.<Number>} -
     */
    getMinMaxLevelFromTileGrid(tilegrid: ol.tilegrid.TileGrid, extent: ol.Extent, projection: ol.ProjectionLike): Array<number>;
    /**
     * @inheritDoc
     */
    createSingleLayerCounterparts(olLayerWithParents: any): Cesium.ImageryLayer[];
    /**
     * Order counterparts using the same algorithm as the Openlayers renderer:
     * z-index then original sequence order.
     * @override
     * @protected
     */
    protected override orderLayers(): void;
    /**
     * @param {Cesium.ImageryLayer} counterpart -
     * @returns {void}
     */
    raiseToTop(counterpart: Cesium.ImageryLayer): void;
}
