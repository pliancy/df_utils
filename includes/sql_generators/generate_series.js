


/**
 * Retrieves the powers of two up to the specified upper bound.
 * @param {number} upper_bound - The upper bound for the powers of two.
 * @returns {number} - The highest power of two that is less than or equal to the upper bound.
 */
function get_powers_of_two(upper_bound) {
    return adapter.dispatch('get_powers_of_two', 'dbt_utils')(upper_bound);
}

/**
 * Default implementation of the get_powers_of_two function.
 * @param {number} upper_bound - The upper bound for the powers of two.
 * @returns {number} - The highest power of two that is less than or equal to the upper bound.
 */
function default__get_powers_of_two(upper_bound) {
    if (upper_bound <= 0) {
        exceptions.raise_compiler_error("upper bound must be positive");
    }

    for (let i = 1; i < 100; i++) {
        if (upper_bound <= Math.pow(2, i)) {
            return i;
        }
    }
}

/**
 * Generates a series of numbers up to the specified upper bound.
 * @param {number} upper_bound - The upper bound for the generated series.
 * @returns {string} - The SQL query for generating the series.
 */
function generate_series(upper_bound) {
    return adapter.dispatch('generate_series', 'dbt_utils')(upper_bound);
}

/**
 * Default implementation of the generate_series function.
 * @param {number} upper_bound - The upper bound for the generated series.
 * @returns {string} - The SQL query for generating the series.
 */
function default__generate_series(upper_bound) {
    let n = dbt_utils.get_powers_of_two(upper_bound);

    let query = `with p as (
        select 0 as generated_number union all select 1
    ), unioned as (
        select`;

    for (let i = 0; i < n; i++) {
        query += `
            p${i}.generated_number * Math.pow(2, ${i})`;

        if (i !== n - 1) {
            query += " +";
        }
    }

    query += `
            + 1 as generated_number
        from`;

    for (let i = 0; i < n; i++) {
        query += `
            p as p${i}`;

        if (i !== n - 1) {
            query += " cross join";
        }
    }

    query += `
    )
    select *
    from unioned
    where generated_number <= ${upper_bound}
    order by generated_number`;

    return query;
}
