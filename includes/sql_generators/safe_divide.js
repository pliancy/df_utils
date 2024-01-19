/**
 * Safely divides the numerator by the denominator.
 * Returns a SQL expression that performs the division, handling division by zero.
 *
 * @param {number} numerator - The numerator value.
 * @param {number} denominator - The denominator value.
 * @returns {string} - The SQL expression for the safe division.
 */
function safeDivide(numerator, denominator) {
    return `(${numerator}) / nullif((${denominator}), 0)`;
}
