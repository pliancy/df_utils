const { group_by } = require('../')

describe('group_by', () => {
    it('is awkward to import this one', () => {
        expect(group_by.group_by(0, [])).toEqual('group by ')
    })
})
