/**
 * Unpivots a given relation by transforming columns into rows.
 * This function generates a SQL query that performs the unpivot operation.
 *
 * @param {string} relation - The name of the relation to unpivot.
 * @param {string} [cast_to='varchar'] - The data type to cast the value column to.
 * @param {string[]} columns= [] - An array representing the collection of columns in the table.
 * @param {string[]} [exclude=[]] - An array of column names to exclude from the unpivot operation.
 * @param {string[]} [remove=[]] - An array of column names to remove from the unpivot operation.
 * @param {string} [field_name='field_name'] - The name of the column that will store the original column names.
 * @param {string} [value_name='value'] - The name of the column that will store the values.
 * @returns {string} - The generated SQL query for the unpivot operation.
 */
function unpivot(relation, cast_to = 'string', columns = [], exclude = [], remove = [], field_name = 'field_name', value_name = 'value') {
    if (!relation) {
        throw new Error("Error: argument 'relation' is required for 'unpivot' function.");
    }

    const include_cols = [];
    const cols = columns;

    for (const col of cols) {
        if (!remove.includes(col.toLowerCase()) && !exclude.includes(col.toLowerCase())) {
            include_cols.push(col);
        }
    }
    let sql = '';
    for (let i = 0; i < include_cols.length; i++) {
        const col = include_cols[i];
        sql += `
        select
          ${exclude.toString()},
          cast('${col}' as string) as ${field_name},
          cast(${col} as ${cast_to}) as ${value_name}
        from ${relation}
      `;
        if (i !== include_cols.length - 1) {
            sql += ' union all';
        }
    }

    return sql;
}


module.exports = {
    unpivot
}