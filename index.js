// Description: Index file for the library
const includesDeduplicate = require('./includes/deduplicate');
const includesGroupBy = require('./includes/group_by');
const includesUnpivot = require('./includes/unpivot');

const deduplicate = includesDeduplicate.deduplicate;
const group_by = includesGroupBy.group_by;
const unpivot = includesUnpivot.unpivot;

module.exports = {
  deduplicate,
  group_by,
  unpivot
};
