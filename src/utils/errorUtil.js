const { validationResult } = require('express-validator');

const logger = require('../../logger');
const StatusEnums = require('../enums/statusEnums');
const ErrorEnums = require('../enums/errorEnums');

const LogService = require('../services/LogService');

const errorFormatter = (error) => `${error.param}: ${error.msg}`;

module.exports = {
  errorResponder: (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      logger.error({
        headers: req.headers,
        errors,
      });

      return res.status(StatusEnums.BAD_REQUEST).send({
        message: (errors.array() || [])[0],
        code: ErrorEnums.CLIENT_READ,
      });
    }

    if (next) return next();
    return true;
  },
  errorHandler: (res, thrownError, logObj) => {
    let errorMessage = thrownError.message || 'Internal server error';
    let errorCode = thrownError.code || ErrorEnums.SERVER_READ;
    let errorStatus = thrownError.status || StatusEnums.INTERNAL_SERVER_ERROR;

    // It is an silly error so run this in a IF block
    if (thrownError.name === 'MongoError' && thrownError.code === 11000) {
      const key = thrownError.keyValue?.key;
      errorCode = ErrorEnums.DUPLICATE_KEY;
      errorStatus = StatusEnums.BAD_REQUEST;
      errorMessage = `Duplicate key: ${key}`;
    }

    const errors = {
      code: errorCode,
      message: errorMessage,
    };

    LogService.create({
      ...logObj,
      metadata: {
        ...logObj.metadata,
        errors,
      },
    });

    return res.status(errorStatus).send(errors);
  },
};
