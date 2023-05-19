const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const BadRequestError = require('../errors/BadRequestError');

const PasswordService = require('./PasswordService');

const AccountEnums = require('../enums/accountEnums');
const ErrorEnums = require('../enums/errorEnums');
const GenderEnums = require('../enums/genderEnums');
const MaritalStatusEnums = require('../enums/maritalStatusEnums');

const logger = require('../../logger');
const { validateMongoId } = require('../utils/validationUtils');

const { ObjectId } = mongoose.Types;

class UserService {
  static async checkEmails(email) {
    logger.info(`[UserService.checkEmail]: email: ${email}`);
    try {
      return await User.checkEmail(email);
    } catch (error) {
      logger.error(`[UserService.checkEmail]: ${error.message}`);
      throw new Error(error);
    }
  }

  static async validateCreateUserFields(fields) {
    logger.info(`[UserService.validateCreateUserFields] fields: ${fields}`);
    try {
      if (!fields.firstName || typeof fields.firstName !== 'string')
        throw new BadRequestError(
          ErrorEnums.MISSING_PARAMS_OR_DATA,
          'firstName: value must be a string ',
        );
      if (!fields.lastName || typeof fields.firstName !== 'string')
        throw new BadRequestError(
          ErrorEnums.MISSING_PARAMS_OR_DATA,
          'lastName: value must be a string ',
        );
      if (!fields.email || typeof fields.email !== 'string')
        throw new BadRequestError(
          ErrorEnums.CLIENT_CREATE,
          ErrorEnums.EMAIL_MISSING,
        );
      if (!fields.gender || !Object.keys(GenderEnums).includes(fields.gender))
        throw new BadRequestError(
          ErrorEnums.INVALID_GENDER,
          `Gender Provided must be one this ${Object.keys(GenderEnums).join(
            ',',
          )}`,
        );
      if (!fields.age || typeof fields.age !== 'number')
        throw new BadRequestError(
          ErrorEnums.MISSING_PARAMS_OR_DATA,
          'age: must be a number',
        );
      if (!fields.dateOfBirth || !(fields.dateOfBirth instanceof Date))
        throw new BadRequestError(
          ErrorEnums.MISSING_PARAMS_OR_DATA,
          'dateOfBirth: must be a date',
        );
      if (
        !fields.maritalStatus ||
        !Object.keys(MaritalStatusEnums).includes(fields.maritalStatus)
      )
        throw new BadRequestError(
          ErrorEnums.MISSING_PARAMS_OR_DATA,
          `MaritalStatus Provided must be one this ${Object.keys(
            MaritalStatusEnums,
          ).join(',')}`,
        );
      const nationality = countries.filter(
        (country) => country.nationality === fields.nationality,
      );
      if (!nationality || typeof fields.nationality !== 'string')
        throw new BadRequestError(
          ErrorEnums.MISSING_PARAMS_OR_DATA,
          'Nationality: must be a string',
        );
      if (
        !fields.account ||
        !Object.keys(AccountEnums).includes(fields.account)
      )
        throw new BadRequestError(
          ErrorEnums.MISSING_PARAMS_OR_DATA,
          `Account Provided must be one this ${Object.keys(AccountEnums).join(
            ',',
          )}`,
        );
      if (fields.email && !validateEmail(fields.email))
        throw new BadRequestError(
          ErrorEnums.INVALID_EMAIL,
          ErrorEnums.CLIENT_CREATE,
        );
    } catch (error) {}
  }

  static async createUser(payload) {
    logger.info(`[UserService.createUser] payload: ${payload}`);
    try {
      UserService.validateCreateUserFields(payload);

      const password = PasswordService.hash(payload.password);
      const refreshToken = jwt.sign({ email: payload.email }, 'refresh-secret');
      const data = {
        ...payload,
        verified: false,
        password: password,
        refreshToken: refreshToken,
        createAt: new Date(),
      };
      return await this.create(data);
    } catch (error) {
      logger.log('error', error.stack || error.message);
      throw error;
    }
  }

  static async create(data) {
    logger.info(`[UserService.create] data: ${data}`);
    try {
      const userData = { ...data };
      const accessToken = jwt.sign({ email: userData.email }, 'secret', {
        expiresIn: '15m',
      });
      const user = await User.create(userData);

      return { ...user._doc, authToken: accessToken };
    } catch (error) {
      logger.log('error', error.stack || error.message);
      throw error;
    }
  }

  static async getUser({ id, email }) {
    logger.info(`[UserService.getUser] id: ${id} \n email: ${email}`);
    try {
      return await User.findOne({
        $or: [{ _id: id }, { email: email }],
      }).lean();
    } catch (error) {
      logger.error(error.stack || error.message);
      throw new Error(error);
    }
  }

  static async getVerified(id) {
    logger.info(`[UserService.getVerified]: id: ${id}`);
    try {
      if (!id || !validateMongoId(id))
        throw new BadRequestError(ErrorEnums.INVALID_ID, 'Id is not valid');
      const user = await User.findById({ id });
      if (!user.verified) return false;
      return true;
    } catch (error) {
      logger.error(error.message);
      throw new Error(error);
    }
  }
}

module.exports = UserService;
