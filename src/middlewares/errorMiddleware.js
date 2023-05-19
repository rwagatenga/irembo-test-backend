/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
const path = require('path');
const ErrorStackParser = require('error-stack-parser');

const ErrorEnums = require('../enums/errorEnums');
const StatusEnums = require('../enums/statusEnums');

const LogService = require('../services/LogService');

const logger = require('../../logger');

const errorHandler = async (err, req, res, next) => {
  let message = err.message || 'Internal server error';
  let code = err.code || ErrorEnums.SERVER_READ;
  let statusCode = err.status || StatusEnums.INTERNAL_SERVER_ERROR;

  if (err && typeof err.array === 'function') {
    // Case: Router validation error
    message = (err.array() || [])
      .map((error) => error)
      .join(', ')
      .toString();
    code = ErrorEnums.CLIENT_READ;
    statusCode = StatusEnums.BAD_REQUEST;
    logger.error(`[Router Error] ${message}`);
  } else {
    // Case: Logic error
    const stackFrame = ErrorStackParser.parse(err)[0];
    const { name: fileName } = path.parse(stackFrame.getFileName());
    const functionName = stackFrame.getFunctionName();
    logger.error(`[${fileName}.${functionName}] Error: ${err.message}`);
  }

  // Special case: MongoError + Duplicate key
  if (err.name === 'MongoError' && err.code === 11000) {
    const key = err.keyValue?.key;
    message = `Duplicate key: ${key}`;
    code = ErrorEnums.DUPLICATE_KEY;
    statusCode = StatusEnums.BAD_REQUEST;
  }

  const error = { message, code };

  LogService.create({
    ...(req.logObj || {}),
    metadata: {
      ...(req.logObj?.metadata || {}),
      error,
    },
  });

  return res.status(statusCode).send(error);
};

module.exports = {
  errorHandler,
};
