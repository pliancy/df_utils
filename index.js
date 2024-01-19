// Description: Index file for the library
const includesDeduplicate = require('./includes/sql_generators/deduplicate');
const includesGroupBy = require('./includes/sql_generators/group_by');
const includesUnpivot = require('./includes/sql_generators/unpivot');

const deduplicate = includesDeduplicate.deduplicate;
const group_by = includesGroupBy.group_by;
const unpivot = includesUnpivot.unpivot;

module.exports = {
  deduplicate,
  group_by,
  unpivot
};
