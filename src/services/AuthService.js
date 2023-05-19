const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const BadRequestError = require('../errors/BadRequestError');

const StatusEnums = require('../enums/statusEnums');

const logger = require('../../logger');

class AuthService {
  static async login(loginUser, password) {
    logger.info(`[AuthService.login] loginUser: ${loginUser}`);
    const { email } = loginUser;
    console.log(loginUser.password);
    try {
      const user = await User.findByEmail(email);
      if (!user)
        throw new BadRequestError(
          StatusEnums.BAD_REQUEST,
          'Invalid email or password',
        );
      const passwordMatch = await bcrypt.compare(
        password,
        loginUser.password.hash,
      );
      if (!passwordMatch)
        throw new BadRequestError(
          StatusEnums.BAD_REQUEST,
          'Invalid username or password',
        );
      const accessToken = jwt.sign({ email: email }, 'secret', {
        expiresIn: '15m',
      });

      const refreshedToken = jwt.sign({ email: email }, 'refresh-secret');
      const updatedToken = await User.findOneAndUpdate(
        { email: email },
        { $set: { refreshToken: refreshedToken } },
      );

      return { ...updatedToken._doc, accessToken };
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = AuthService;
