declare namespace _default {
    export function createMap(config?: {
        target?: string;
        namedProjections?: string;
        backgroundImage?: string;
        epsg?: string;
        extent?: number[];
        options?: Array<{
            resolution: number;
            scale: number;
            zoomLevel: number;
        }>;
        options?: {
            resolution: number;
            scale: number;
            zoomLevel: number;
        }[];
        startResolution?: number;
        startCenter?: number[];
        layerConf?: (string | object);
        gazetteerUrl?: string;
    }, mapMode?: string, settings?: {
        mapParams?: object;
        callback?: Function;
        errorCallback?: Function;
    }): any;
    export { olcsMap };
}
export default _default;
import * as olcsMap from "./olcs/olcsMap.js";
