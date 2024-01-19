/**
 * Generates a string representing a "group by" clause in SQL.
 * 
 * @param {number} n - The number of columns to group by.
 * @param {number[]} [excludeArray=[]] - An optional array of column numbers to exclude from the "group by" clause.
 * @returns {string} - The generated "group by" clause.
 */
function group_by(n, excludeArray = []) {
    let result = 'group by ';
    for (let i = 1; i <= n; i++) {
        if (!excludeArray.includes(i)) {
            result += i;
            if (i !== n) {
                result += ', ';
            }
        }
    }
    return result;
}


module.exports = {
    group_by
}
