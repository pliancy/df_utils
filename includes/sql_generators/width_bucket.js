/**
 * Calculates the bucket number for a given expression based on the specified range and number of buckets.
 *
 * @param {number} expr - The expression to calculate the bucket number for.
 * @param {number} min_value - The minimum value of the range.
 * @param {number} max_value - The maximum value of the range.
 * @param {number} num_buckets - The number of buckets to divide the range into.
 * @returns {number} - The bucket number for the given expression.
 */
function width_bucket(expr, min_value, max_value, num_buckets) {
    const bin_size = (max_value - min_value) / num_buckets;

    return (
        (expr % bin_size === 0 ? 1 : 0) +
        Math.min(
            Math.ceil((expr - min_value) / bin_size),
            num_buckets + 1
        )
    );
}