const { group_by } = require('../')

describe('group_by', () => {
    it('is awkward to import this one', () => {
        const groupBy = group_by.group_by(0, [])
        expect(groupBy).toEqual('group by ')
    })
})
