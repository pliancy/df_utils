/**
 * Retrieves the intervals between two dates based on a specified datepart.
 * @param {string} start_date - The start date.
 * @param {string} end_date - The end date.
 * @param {string} datepart - The datepart to calculate the intervals (e.g., "day", "week", "month").
 * @returns {number} - The number of intervals between the start and end dates.
 */
function get_intervals_between(start_date, end_date, datepart) {
    return adapter.dispatch('get_intervals_between', 'dbt_utils')(start_date, end_date, datepart);
}

/**
 * Default implementation of the get_intervals_between function.
 * @param {string} start_date - The start date.
 * @param {string} end_date - The end date.
 * @param {string} datepart - The datepart to calculate the intervals (e.g., "day", "week", "month").
 * @returns {number} - The number of intervals between the start and end dates.
 */
function default__get_intervals_between(start_date, end_date, datepart) {
    statement('get_intervals_between', fetch_result=true);

    return `
        select ${dbt.datediff(start_date, end_date, datepart)}
    `;

    let value_list = load_result('get_intervals_between');

    if (value_list && value_list['data']) {
        let values = value_list['data'].map(item => item[0]);
        return values[0];
    } else {
        return 1;
    }
}

/**
 * Generates a date spine between two dates based on a specified datepart.
 * @param {string} datepart - The datepart to generate the date spine (e.g., "day", "week", "month").
 * @param {string} start_date - The start date.
 * @param {string} end_date - The end date.
 * @returns {string} - The SQL query for the filtered date spine.
 */
function date_spine(datepart, start_date, end_date) {
    return adapter.dispatch('date_spine', 'dbt_utils')(datepart, start_date, end_date);
}

/**
 * Default implementation of the date_spine function.
 * @param {string} datepart - The datepart to generate the date spine (e.g., "day", "week", "month").
 * @param {string} start_date - The start date.
 * @param {string} end_date - The end date.
 * @returns {string} - The SQL query for the filtered date spine.
 */
function default__date_spine(datepart, start_date, end_date) {
    // call as follows:
    // date_spine(
    //     "day",
    //     "to_date('01/01/2016', 'mm/dd/yyyy')",
    //     "dbt.dateadd(week, 1, current_date)"
    // )

    let rawdata = dbt_utils.generate_series(
        dbt_utils.get_intervals_between(start_date, end_date, datepart)
    );

    let all_periods = `
        select
            ${dbt.dateadd(datepart, "row_number() over (order by 1) - 1", start_date)} as date_${datepart}
        from
            rawdata
    `;

    let filtered = `
        select *
        from all_periods
        where date_${datepart} <= ${end_date}
    `;

    return filtered;
}
