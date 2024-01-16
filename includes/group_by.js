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
