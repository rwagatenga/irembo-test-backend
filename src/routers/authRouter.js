const { check } = require('express-validator');
const express = require('express');

const router = express.Router();

const AuthController = require('../controllers/AuthController');

const { asyncHandler } = require('../middlewares/controllerMiddleware');

router.post(
  '/login',
  [check('email').isEmail(), check('password').not().isEmpty()],
  asyncHandler(AuthController.login),
);

router.post('/logout', [check('userId').isMongoId()], AuthController.logout);

module.exports = router;
