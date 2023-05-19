const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  performedBy: String,
  userAgent: String,
  action: String,
  createdAt: Date,
  metadata: mongoose.Schema.Types.Mixed,
});

ActivityLogSchema.index({ group: 1, performedBy: 1 });
ActivityLogSchema.index({ action: 1, 'metadata.processId': 1 });

module.exports = ActivityLogSchema;
