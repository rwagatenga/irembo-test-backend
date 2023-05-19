const STATUS_ENUMS = require('../enums/statusEnums');

class NotFoundError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
    this.status = STATUS_ENUMS.NOT_FOUND;
  }
}

module.exports = NotFoundError;
