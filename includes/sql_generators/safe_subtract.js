
/**
 * Safe cross-database method to take the difference of nullable fields using the fields specified.
 * 
 * @param {Array} fieldList - The array of fields to subtract.
 * @returns {string} - The SQL expression for subtracting the fields.
 * @throws {Error} - If the argument is not an array.
 */
function safeSubtract(fieldList) {
    if (!Array.isArray(fieldList)) {
        throw new Error('The safeSubtract function expects an array argument.');
    }

    const fields = fieldList.map(field => `coalesce(${field}, 0)`);

    return fields.join(' -\n  ');
}