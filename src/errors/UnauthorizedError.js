const STATUS_ENUMS = require('../enums/statusEnums');

class UnauthorizedError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
    this.status = STATUS_ENUMS.UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
