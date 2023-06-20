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
  // group_by,
  // safe_add,
  // safe_divide,
  // safe_subtract,
  // star
}
