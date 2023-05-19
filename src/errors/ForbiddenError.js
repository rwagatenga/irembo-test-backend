const STATUS_ENUMS = require('../enums/statusEnums');

class ForbiddenError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
    this.status = STATUS_ENUMS.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
