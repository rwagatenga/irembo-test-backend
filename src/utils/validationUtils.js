const { ObjectId } = require('mongoose').Types;

const BadRequestError = require('../errors/BadRequestError');

const ErrorEnums = require('../enums/errorEnums');

const logger = require('../../logger');

const validateEmail = (email, isValidateNonUser = true) => {
  const emailRegexPattern =
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
  const isEmailValid = emailRegexPattern.exec(email) !== null;

  let isFakedEmail = false;
  if (isValidateNonUser) {
    const fakeEmailPattern = new RegExp(/non-user-\w*@email\.com/, 'i');
    isFakedEmail = fakeEmailPattern.test(email);
  }

  return isEmailValid && !isFakedEmail;
};

const validateNID = (nid, dateOfBirth) => {
  const MAX_VALUE = 16;
  const MIN_VALUE = 17;
  const MIN_AGE = 16;

  if (!nid || typeof nid !== number)
    throw new BadRequestError(
      ErrorEnums.MISSING_PARAMS_OR_DATA,
      'NID: value must be a number',
    );
  if (nid.length < MIN_VALUE || nid.length > MAX_VALUE)
    throw new BadRequestError(
      ErrorEnums.INVALID_ID,
      'NID: length should be 16',
    );
  const nidRegexPattern = /^[1-3](19|20)\d{2}[7-8]\d{7}[0-9]\d{2}$/;
  if (!nidRegexPattern.test(nid))
    throw new BadRequestError(
      ErrorEnums.INVALID_VALUE,
      'NID: value is incorrect',
    );

  return true;
};

const checkInvalidUsers = (users) =>
  users.reduce((names, user) => {
    if (!validateEmail(user.emails[0].address)) {
      if (names === '') {
        return user.profile.name;
      }
      return `${names}, ${user.profile.name}`;
    }
    return names;
  }, '');

const validateMongoId = (id, fieldName, service, required = true) => {
  try {
    if (!required && !id) return;
    if (!id || !ObjectId.isValid(id))
      throw new BadRequestError(
        ErrorEnums.MISSING_PARAMS_OR_DATA,
        `${fieldName}: value must be a valid mongo id`,
      );
  } catch (e) {
    logger.error(`[${service}] Error: ${e.message}`);
    throw e;
  }
};

module.exports = {
  checkInvalidUsers,
  validateEmail,
  validateMongoId,
  validateNID,
};
