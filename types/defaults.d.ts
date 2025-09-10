declare const _default: {
    target: string;
    epsg: string;
    backgroundImage: string;
    extent: number[];
    options: {
        resolution: number;
        scale: number;
        zoomLevel: number;
    }[];
    namedProjections: string[][];
    startResolution: number;
    startCenter: number[];
    layerConf: string;
    layers: {
        id: string;
        visibility: boolean;
    }[];
    gazetteerUrl: string;
    showGeographicIdentifier: boolean;
    sceneOptions: {
        camera: {
            enableTerrainAdjustmentWhenLoading: boolean;
        };
        globe: {
            depthTestAgainstTerrain: boolean;
        };
        highDynamicRange: boolean;
        pickTranslucentDepth: boolean;
        shadowMap: {
            darkness: number;
            maximumDistance: number;
            size: number;
        };
        shadows: boolean;
    };
};
export default _default;
