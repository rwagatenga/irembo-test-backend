const STATUS_ENUMS = require('../enums/statusEnums');

class BadRequestError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
    this.status = STATUS_ENUMS.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
