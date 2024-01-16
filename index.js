// Description: Index file for the library
const deduplicate = require('./includes/deduplicate');
const group_by = require('./includes/group_by');
const unpivot = require('./includes/unpivot');

deduplicate.deduplicate();
group_by.group_by();
unpivot.unpivot();

module.exports = {
  deduplicate,
  group_by,
  unpivot
};
