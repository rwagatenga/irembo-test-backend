const { check } = require('express-validator');
const express = require('express');

const router = express.Router();

const UserController = require('../controllers/UserController');

const GenderEnums = require('../enums/genderEnums');
const MaritalStatusEnums = require('../enums/maritalStatusEnums');

const { asyncHandler } = require('../middlewares/controllerMiddleware');

router.post(
  '/user',
  [
    check('email').isEmail(),
    check('password').not().isEmpty(),
    check('gender').isIn(Object.values(GenderEnums)),
    check('maritalStatus').isIn(Object.values(MaritalStatusEnums)),
  ],
  asyncHandler(UserController.create),
);

module.exports = router;
