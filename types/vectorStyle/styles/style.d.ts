export default StyleClass;
declare class StyleClass {
    /**
     * @param {ol/feature} feature Feature to be styled.
     * @param {object} style styling properties to overwrite defaults
     * @param {Boolean} isClustered Flag to show if feature is clustered.
     * @constructor
     */
    constructor(feature: any, style: object, isClustered: boolean);
    feature: any;
    style: any;
    isClustered: boolean;
    attributes: {};
    legendInfos: any[];
    styleMultiGeomOnlyWithRule: boolean;
    nullStyle: boolean;
    /**
     * setter for feature
     * @param {ol/feature} value the feature to set
     * @returns {void}
     */
    setFeature(value: any): void;
    /**
     * Setter for style.
     * @param {object} value the style to set
     * @returns {void}
     */
    setStyle(value: object): void;
    /**
     * Getter for style.
     * @returns {ol/style} - The style.
     */
    getStyle(): ol;
    overwriteStyling(styles: any): void;
    /**
     * setter for isClustered
     * @param {Boolean} value isClustered
     * @returns {void}
     */
    setIsClustered(value: boolean): void;
    /**
     * returns the legend info
     * @returns {object[]} legend objects
     */
    getLegendInfos(): object[];
    /**
     * Returns an id created from geometryType and conditions using encodeURIComponent.
     * @param   {string} geometryType features geometry type
     * @param   {object} rule         a rule description
     * @returns {string} id
     */
    createLegendId(geometryType: string, rule: object): string;
    /**
     * Returns the label or null examining some attributes. Giving precedence to "legendValue". Otherwhile creates a string out of rules conditions.
     * @param   {Object} rule conditions
     * @param   {vectorStyle/style} styleObject a vector style needed in
     * @returns {String | null} label for styleObject
     */
    createLegendLabel(rule: any, styleObject: any): string | null;
    /**
     * Adds a unique legendInfo for each id to vectorStyle model to be used for legend descriptions.
     * @param {string} geometryType features geometry type needed in legend model
     * @param {vectorStyle/style} styleObject  a vector style needed in
     * @param {Object} rule conditions
     * @returns {void}
     */
    addLegendInfo(geometryType: string, styleObject: any, rule: any): void;
    /**
     * Returns the value of the given field. Also considers that the field can be an object path.
     * @param {Object} featureProperties Feature properties.
     * @param {String} field Field to get value.
     * @returns {*} - Value from given field.
     */
    prepareField(featureProperties: any, field: string): any;
}
