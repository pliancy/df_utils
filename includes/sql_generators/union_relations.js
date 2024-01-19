/**
 * Generates a SQL query that performs a union operation on multiple relations.
 * 
 * @param {string[]} relations - The list of relations to union.
 * @param {object} [columnOverride=null] - An object that overrides the data type of specific columns.
 * @param {string[]} [include=[]] - The list of columns to include in the union.
 * @param {string[]} [exclude=[]] - The list of columns to exclude from the union.
 * @param {string} [sourceColumnName='_dbt_source_relation'] - The name of the column that represents the source relation.
 * @param {string} [where=null] - The WHERE clause to apply to the union query.
 * @returns {string} The SQL query that performs the union operation.
 * @throws {Error} If both an exclude and include list are provided. Only one is allowed.
 */
function unionRelations(relations, columnOverride = null, include = [], exclude = [], sourceColumnName = '_dbt_source_relation', where = null) {
    return adapter.dispatch('union_relations', 'dbt_utils')(relations, columnOverride, include, exclude, sourceColumnName, where);
}


/**
 * Generates a SQL query that performs a union operation on multiple relations.
 *
 * @param {Array<string>} relations - The list of relations to union.
 * @param {Object|null} column_override - Optional. An object that overrides the data type of specific columns.
 * @param {Array<string>} include - Optional. The list of columns to include in the union.
 * @param {Array<string>} exclude - Optional. The list of columns to exclude from the union.
 * @param {string|null} source_column_name - Optional. The name of the source column to add to the union query.
 * @param {string|null} where - Optional. The WHERE clause to apply to the union query.
 * @returns {string} The generated SQL query.
 * @throws {Error} If both an exclude and include list were provided. Only one is allowed.
 */
function default__union_relations(relations, column_override = null, include = [], exclude = [], source_column_name = '_dbt_source_relation', where = null) {
    if (exclude.length > 0 && include.length > 0) {
        throw new Error("Both an exclude and include list were provided to the `union` macro. Only one is allowed");
    }

    if (!execute) {
        return '';
    }

    column_override = column_override || {};

    let relation_columns = {};
    let column_superset = {};
    let all_excludes = [];
    let all_includes = [];

    if (exclude.length > 0) {
        for (let exc of exclude) {
            all_excludes.push(exc.toLowerCase());
        }
    }

    if (include.length > 0) {
        for (let inc of include) {
            all_includes.push(inc.toLowerCase());
        }
    }

    for (let relation of relations) {
        relation_columns[relation] = [];

        // Check if relation is valid and not ephemeral
        dbt_utils._is_relation(relation, 'union_relations');
        dbt_utils._is_ephemeral(relation, 'union_relations');

        let cols = adapter.get_columns_in_relation(relation);
        for (let col of cols) {
            if (exclude.length > 0 && all_excludes.includes(col.column.toLowerCase())) {
                continue;
            } else if (include.length > 0 && !all_includes.includes(col.column.toLowerCase())) {
                continue;
            } else {
                relation_columns[relation].push(col.column);

                if (col.column in column_superset) {
                    let stored = column_superset[col.column];
                    if (col.is_string() && stored.is_string() && col.string_size() > stored.string_size()) {
                        column_superset[col.column] = col;
                    }
                } else {
                    column_superset[col.column] = col;
                }
            }
        }
    }

    let ordered_column_names = Object.keys(column_superset);
    let dbt_command = flags.WHICH;

    if (dbt_command === 'run' || dbt_command === 'build') {
        if ((include.length > 0 || exclude.length > 0) && Object.keys(column_superset).length === 0) {
            let relations_string = relations.map(relation => relation.name).join(', ');
            let error_message = `There were no columns found to union for relations ${relations_string}`;
            throw new Error(error_message);
        }
    }

    let unionQueries = [];
    for (let relation of relations) {
        let columns = [];
        if (source_column_name !== null) {
            columns.push(`cast(${dbt.string_literal(relation)} as ${dbt.type_string()}) as ${source_column_name}`);
        }

        for (let col_name of ordered_column_names) {
            let col = column_superset[col_name];
            let col_type = column_override[col.column] || col.data_type;
            let col_name_in_relation = relation_columns[relation].includes(col_name) ? adapter.quote(col_name) : 'null';
            columns.push(`cast(${col_name_in_relation} as ${col_type}) as ${col.quoted}`);
        }

        let query = `select ${columns.join(', ')} from ${relation}`;
        if (where !== null) {
            query += ` where ${where}`;
        }

        unionQueries.push(query);
    }

    return unionQueries.join('\nunion all\n');
}
