const express = require('express');

const router = express.Router();

const authRouter = require('./authRouter');
const userRouter = require('./userRouter');

const apiPath = '/api/v1';

router.use(apiPath, authRouter);
router.use(apiPath, userRouter);

module.exports = router;
