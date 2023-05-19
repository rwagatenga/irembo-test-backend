const ActivityLog = require('../models/ActivityModel');

const logger = require('../../logger');

class LogService {
  static create(data) {
    const { performedBy, userAgent, action, metadata } = data;

    try {
      const logData = {
        performedBy,
        userAgent,
        action,
        metadata,
        createdAt: new Date(),
      };

      ActivityLog.create(logData);
    } catch (e) {
      logger.log('error', e.message);
    }
  }
}

module.exports = LogService;
