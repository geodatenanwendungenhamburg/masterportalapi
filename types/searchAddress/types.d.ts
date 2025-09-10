export namespace searchTypes {
    let STREET: string;
    let DISTRICT: string;
    let PARCEL: string;
    let STREET_KEY: string;
    let ADDRESS_AFFIXED: string;
    let ADDRESS_UNAFFIXED: string;
    let HOUSE_NUMBERS_FOR_STREET: string;
}
export type SearchResult = {
    /**
     * which kind of hit this is
     */
    type: string;
    /**
     * contents of the hit as parsed by xml2js - e.g. contains $ keys for xml attributes
     */
    properties: object;
    /**
     * may be a point, a bbox, a polygon, ...
     */
    geometry: object;
};
