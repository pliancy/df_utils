function unpivot(relation, cast_to = 'varchar', exclude = [], remove = [], field_name = 'field_name', value_name = 'value') {
    if (!relation) {
        throw new Error("Error: argument 'relation' is required for 'unpivot' function.");
    }

    const include_cols = [];
    const table_columns = {};
    table_columns[relation] = [];

    // Check if relation is valid and not ephemeral
    dbt_utils._is_relation(relation, 'unpivot');
    dbt_utils._is_ephemeral(relation, 'unpivot');

    const cols = adapter.get_columns_in_relation(relation);

    for (const col of cols) {
        if (!remove.map(col => col.toLowerCase()).includes(col.column.toLowerCase()) && !exclude.map(col => col.toLowerCase()).includes(col.column.toLowerCase())) {
            include_cols.push(col);
        }
    }

    let sql = '';
    for (let i = 0; i < include_cols.length; i++) {
        const col = include_cols[i];
        sql += `
        select
          ${exclude.join(', ')},
          cast('${col.column}' as ${dbt.type_string()}) as ${field_name},
          cast(${col.data_type === 'boolean' ? dbt.cast_bool_to_text(col.column) : col.column} as ${cast_to}) as ${value_name}
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
