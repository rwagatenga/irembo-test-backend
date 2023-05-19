/* eslint-disable func-names */
const mongoose = require('mongoose');

const AccountEnums = require('../enums/accountEnums');
const GenderEnums = require('../enums/genderEnums');
const MaritalStatusEnums = require('../enums/maritalStatusEnums');

const { getFilterRegex } = require('../utils/stringUtils');

const UsersSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  gender: {
    type: String,
    enum: GenderEnums,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  maritalStatus: {
    type: String,
    enum: MaritalStatusEnums,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    enum: AccountEnums,
    default: AccountEnums.UNVERIFIED,
  },
  identity: {
    NID: Number,
    passport: String,
  },
  verified: Boolean,
  profilePhoto: {
    type: String,
  },
  password: {
    hash: String,
    secret: String,
  },
  refreshToken: String,
  createdAt: Date,
});

UsersSchema.statics.findByEmail = function (name, skip, limit) {
  const skipPage = parseInt(skip, 10) || 0;
  const limitPage = parseInt(limit, 10) || 0;
  let conditions = {};
  if (name) {
    conditions = {
      email: {
        $regex: `.*${getFilterRegex([name])}.*`,
        $options: 'i',
      },
    };
  }

  return this.find(conditions).skip(skipPage).limit(limitPage).sort({
    firstName: 1,
    lastName: 1,
  });
};

UsersSchema.statics.checkEmail = function (email) {
  return this.findOne({ email });
};

UsersSchema.index({ firstName: 1 });
UsersSchema.index({ lastName: 1 });
UsersSchema.index({ email: 1 });
UsersSchema.index(
  { firstName: 'text' },
  {
    weights: {
      firstName: 10,
    },
    name: 'TextIndex',
  },
);

module.exports = UsersSchema;
