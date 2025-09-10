export default thousandsSeparator;
/**
 * adds thousands seperators into a number and changes the decimal point
 * @param {(Number|String)} num the number as number or string
 * @param {String} [delimAbs="."] the letter(s) to use as thousand point
 * @param {String} [delimDec=","] the letter(s) to use as decimal point
 * @returns {String}  the given number with thousands seperators or an empty string if any invalid num was given
 */
declare function thousandsSeparator(num: (number | string), delimAbs?: string, delimDec?: string): string;
