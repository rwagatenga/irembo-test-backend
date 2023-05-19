const STATUS_ENUMS = require('../enums/statusEnums');

class TooManyRequestsError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
    this.status = STATUS_ENUMS.TOO_MANY_REQUESTS;
  }
}

module.exports = TooManyRequestsError;
