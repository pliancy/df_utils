
/**
 * Generates a SELECT statement with a star (*) to select all columns from a given table or relation.
 * 
 * @param {string} from - The name of the table or relation to select from.
 * @param {boolean} [relation_alias=false] - Whether to include the relation alias in the column names.
 * @param {string[]} [except=[]] - An array of column names to exclude from the selection.
 * @param {string} [prefix=''] - A prefix to add to each column name.
 * @param {string} [suffix=''] - A suffix to add to each column name.
 * @param {boolean} [quote_identifiers=true] - Whether to quote the column names with identifiers.
 * @returns {string} - The generated SELECT statement with the star (*) and column names.
 */
function star(from, relation_alias = false, except = [], prefix = '', suffix = '', quote_identifiers = true) {
    if (!execute) {
        return '*';
    }

    let cols = dbt_utils.get_filtered_columns_in_relation(from, except);

    if (cols.length <= 0) {
        if (flags.WHICH == 'compile') {
            let response = `*
/* No columns were returned. Maybe the relation doesn't exist yet 
or all columns were excluded. This star is only output during  
dbt compile, and exists to keep SQLFluff happy. */`;
            return response;
        } else {
            return "/* no columns returned from star() macro */";
        }
    } else {
        let result = '';
        for (let i = 0; i < cols.length; i++) {
            if (relation_alias) {
                result += relation_alias + '.';
            }
            if (quote_identifiers) {
                result += adapter.quote(cols[i]).trim();
                if (prefix !== '' || suffix !== '') {
                    result += ' as ' + adapter.quote(prefix + cols[i] + suffix).trim();
                }
            } else {
                result += cols[i].trim();
                if (prefix !== '' || suffix !== '') {
                    result += ' as ' + (prefix + cols[i] + suffix).trim();
                }
            }
            if (i !== cols.length - 1) {
                result += ',\n  ';
            }
        }
        return result;
    }
}
