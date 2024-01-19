
/**
 * Generates a surrogate key based on the provided field list.
 * @param {Array<string>} fieldList - The list of fields to generate the surrogate key from.
 * @returns {string} - The generated surrogate key.
 */
function generateSurrogateKey(fieldList) {
    let defaultNullValue = "";
    if (surrogateKeyTreatNullsAsEmptyStrings) {
        defaultNullValue = "";
    } else {
        defaultNullValue = '_dbt_utils_surrogate_key_null_';
    }

    let fields = [];

    for (let i = 0; i < fieldList.length; i++) {
        fields.push(`coalesce(cast(${fieldList[i]} as ${dbt.typeString()}), '${defaultNullValue}')`);
        if (i !== fieldList.length - 1) {
            fields.push("'-'");
        }
    }

    return dbt.hash(fields.join(''));
}