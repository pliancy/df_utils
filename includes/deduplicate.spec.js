const { deduplicate } = require('../')

describe('deduplicate', () => {
    it('works better as an exported function than as an object', () => {
        const deduped = deduplicate('relation', 'partition_by', 'order_by', 'incremental')
        expect(deduped).toEqual(`
    select unique.*
    from (
      select
        array_agg(original
        order by order_by
        limit 1)[offset(0)] as unique
      from relation original
      incremental
      group by partition_by
    )
  `)
    })
})
