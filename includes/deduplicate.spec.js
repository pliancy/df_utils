const { deduplicate } = require('../')

describe('deduplicate', () => {
    it('works better as an exported function than as an object', () => {
        const deduped = deduplicate('relation', 'partition_by', 'order_by', 'incremental')
        expect(deduped).toBeTruthy()
    })
})
