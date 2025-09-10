/**
 * Helper function to detect layer availability/usability. Depending on layer
 * type, the method to infer availability broadly varies.
 * @param {Object} layerSpecification services.json layer specification
 * @returns {Promise} resolves to status code of a layer-specific default
 * request as Number, or null if no request could be made, which should
 * indicate misconfiguration; defaults to 900 if the request itself failed for
 * arbitrary reasons (usually CORS-related)
 */
export default function _default({ url, typ, capabilitiesUrl, ...rest }: any): Promise<any>;
