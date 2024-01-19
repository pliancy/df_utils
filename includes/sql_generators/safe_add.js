

/**
 * Generates a SQL expression that safely adds up nullable fields.
 * If the fieldList parameter is not an array, a warning is logged and the function returns undefined.
 * Each field in the fieldList is wrapped in a COALESCE function to handle null values, and the fields are joined with a plus sign.
 * 
 * @param {Array} fieldList - An array of field names or expressions to be added together.
 * @returns {string|undefined} - The generated SQL expression or undefined if the fieldList parameter is not an array.
 */
function safeAdd(fieldList) {
    if (!Array.isArray(fieldList)) {
        console.warn('Warning: the `safeAdd` function now takes a single array argument instead of string arguments.');
        return;
    }

    var fields = fieldList.map(function(field) {
        return 'coalesce(' + field + ', 0)';
    });

    return fields.join(' +\n  ');
}