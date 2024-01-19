/**
 * Deduplicates records in a relation based on specified partition and order criteria.
 * It generates a SQL query that uses `array_agg` with a limit clause in BigQuery.
 *
 * @param {string} relation - The name of the relation to deduplicate.
 * @param {string} partition_by - The column(s) to partition the deduplication on.
 * @param {string} order_by - The column(s) to order the records within each partition.
 * @param {string} incremental - Optional incremental clause to include in the query.
 * @returns {string} The SQL query for deduplicating the relation.
 */
//  It is more performant to deduplicate using `array_agg` with a limit
//  clause in BigQuery:
//  https://github.com/dbt-labs/dbt-utils/issues/335#issuecomment-788157572
function deduplicate(relation, partition_by, order_by, incremental) {
  const sql = `
    select unique.*
    from (
      select
        array_agg(original
        order by ${order_by}
        limit 1)[offset(0)] as unique
      from ${relation} original
      ${incremental}
      group by ${partition_by}
    )
  `;
  return sql;
}



module.exports = {
  deduplicate
}