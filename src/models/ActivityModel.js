const mongoose = require('mongoose');

const ActivityLogSchema = require('../schemas/ActivityLogSchema');

module.exports = mongoose.model(
  'ActivityLog',
  ActivityLogSchema,
  'activityLogs',
);
