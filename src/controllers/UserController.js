const BadRequestError = require('../errors/BadRequestError');
const LogService = require('../services/LogService');
const PasswordService = require('../services/PasswordService');
const UserService = require('../services/UserService');

const ActivityEnums = require('../enums/activityEnums');
const ErrorEnums = require('../enums/errorEnums');
const StatusEnums = require('../enums/statusEnums');

const { calculateAge } = require('../utils/objectUtils');

const { errorResponder } = require('../utils/errorUtil');
const { validateEmail } = require('../utils/validationUtils');

module.exports = {
  create: async (req, res) => {
    errorResponder(req, res);

    if (res.headsSent) return true;

    const { email, dateOfBirth, password, confirmPassword } = req.body;

    let duplicated;

    const logObj = {
      performedBy: email,
      userAgent: req.headers['user-agent'],
      action: ActivityEnums.USER_CREATE,
      metadata: {
        data: req.body,
      },
    };
    req.logObj = logObj;

    if (email) {
      duplicated = await UserService.checkEmails(email);
    }
    if (duplicated)
      throw new BadRequestError(
        ErrorEnums.USER_ALREADY_EXIST,
        'User Already Exist',
      );
    if (!PasswordService.validatePassword(password)) {
      return res.status(StatusEnums.BAD_REQUEST).send({
        code: ErrorEnums.WRONG_PASSWORD,
        message:
          'Please make a strong password with at least 8 characters long, ' +
          'include at least 1 capital letter, 1 number, 1 special character: !@#$%^&*()-=|',
      });
    }
    if (password !== confirmPassword)
      return res.status(StatusEnums.BAD_REQUEST).send({
        code: ErrorEnums.WRONG_PASSWORD,
        message: 'Password and confirm password do not match',
      });
    const data = {
      ...req.body,
      age: calculateAge(dateOfBirth),
    };

    const user = await UserService.createUser(data);
    if (!user)
      throw new BadRequestError(
        StatusEnums.BAD_REQUEST,
        'User Creation failed',
      );
    ('');
    LogService.create(logObj);

    return res.status(StatusEnums.OK).send({ data: user });
  },
};
