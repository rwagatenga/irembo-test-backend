const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const axios = require('axios');

const BadRequestError = require('../errors/BadRequestError');

const STATUS_ENUMS = require('../enums/statusEnums');
const ERROR_ENUMS = require('../enums/errorEnums');

class PasswordService {
  static hash(password) {
    if (!password || typeof password !== 'string') {
      throw new Error('Invalid Password');
    }

    const salt = bcrypt.genSaltSync(10);

    const hash = bcrypt.hashSync(password, salt);

    return {
      salt,
      hash,
    };
  }

  static validatePassword(password) {
    const pattern =
      /^(?=.*[\d])(?=.*[a-zA-Z])(?=.*[+!@#$%^&*()|=\-?/[\]<>\\~`.,}{:;])[\w+!@#$%^&*()|=\-?/[\]<>\\~`.,}{:;]{8,}$/;
    return pattern.test(password);
  }

  static createToken(email) {
    const uniqueToken = crypto
      .createHmac('sha256', new Date().getTime().toString())
      .update(email)
      .digest('hex');
    return uniqueToken;
  }
}

module.exports = PasswordService;
