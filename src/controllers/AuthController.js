const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const User = require('../models/User');

const AuthService = require('../services/AuthService');
const LogService = require('../services/LogService');
const UserService = require('../services/UserService');

const ActivityEnums = require('../enums/activityEnums');
const ErrorEnums = require('../enums/errorEnums');
const StatusEnums = require('../enums/statusEnums');

const { isObjectEmpty } = require('../utils/objectUtils');

const { errorResponder } = require('../utils/errorUtil');
const { validateEmail } = require('../utils/validationUtils');

const logger = require('../../logger');

const { MONGO_ACCESS_URL } = process.env;

module.exports = {
  login: async (req, res) => {
    errorResponder(req, res);

    if (res.headsSent) return true;

    const { email, password } = req.body;

    const logObj = {
      performedBy: email,
      userAgent: req.headers['user-agent'],
      action: ActivityEnums.LOGIN,
      metadata: {
        email,
        userId: req.headers.userid,
      },
    };

    let mongoConn;
    try {
      const maxConsecutiveFailsByUsernameAndIP = 5;
      const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

      const mongoOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };

      mongoConn = await mongoose.createConnection(MONGO_ACCESS_URL, mongoOpts);
      const opts = {
        storeClient: mongoConn,
        points: maxConsecutiveFailsByUsernameAndIP,
        duration: 60 * 15, // Store number for 15 minutes since first fail
      };

      const rateLimiterMongo = new RateLimiterMongo(opts);

      const ipAddr = req.connection.remoteAddress;
      const usernameIPkey = getUsernameIPkey(email, ipAddr);

      const resUsernameAndIP = await rateLimiterMongo.get(usernameIPkey);

      let retrySecs = 0;

      if (
        (resUsernameAndIP || {}).consumedPoints >=
        maxConsecutiveFailsByUsernameAndIP
      ) {
        retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
      }

      if (retrySecs > 0) {
        res.set('Retry-After', String(retrySecs));
        throw new TooManyRequestsError(
          ErrorEnums.TOO_MANY_REQUESTS,
          'Too Many Requests',
        );
      }

      const loginUser = await UserService.getUser({
        email: email.toLowerCase(),
      });
      if (!loginUser)
        throw new BadRequestError(
          ErrorEnums.EMAIL_PW_NT_MATCH,
          'Account Information is incorrect',
        );
      const user = await AuthService.login(loginUser, password);
      if (!user)
        throw new NotFoundError(StatusEnums.NOT_FOUND, 'Invalid Login');
      LogService.create(logObj);
      return res.status(StatusEnums.OK).send({ data: user });
    } catch (error) {
      logger.error(error.stack || error.message);
      throw new Error(error);
    }
  },

  logout: async (req, res) => {
    errorResponder(req, res);

    if (res.headersSent) {
      return true;
    }
    const { userid } = req.headers;
    try {
      const user = await User.findById(userid);
      if (!user) {
        errors = {
          code: ErrorEnums.EMAIL_PW_NT_MATCH,
          message: 'Account does not exist',
        };
        return res.status(statusEnums.BAD_REQUEST).send(errors);
      }
      const { _id } = user;
      await User.findByIdAndUpdate(_id, { refreshToken: '' });
      return res.status(StatusEnums.NO_CONTENT).send();
    } catch (error) {
      logger.error(error.message);
      throw new Error(error);
    }
  },
};
