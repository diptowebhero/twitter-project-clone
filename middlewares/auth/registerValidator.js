const { check } = require("express-validator");
const createHttpError = require("http-errors");
const User = require("../../models/User");

const registerValidator = [
  check("firstName").notEmpty().withMessage("firstName is require").trim(),
  check("lastName").notEmpty().withMessage("lastName is require").trim(),

  check("username")
    .notEmpty()
    .withMessage("username is require")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ username: value }, { username: 1 });
        if (user) {
          return Promise.reject();
        } else {
          return Promise.resolve();
        }
      } catch (error) {
        throw createHttpError(error);
      }
    })
    .withMessage("Username is already used")
    .trim(),

  check("email")
    .notEmpty()
    .withMessage("Email is require")
    .isEmail()
    .withMessage("Email is not valid")
    .normalizeEmail()
    .custom(async (value) => {
      try {
        const userEmail = await User.findOne({ email: value }, { email: 1 });
        if (userEmail) {
          return Promise.reject();
        } else {
          return Promise.resolve();
        }
      } catch (error) {
        throw createHttpError(error);
      }
    })
    .withMessage("Email is already used")
    .trim(),

  check("password")
    .notEmpty()
    .withMessage("Password is require")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 chars long & should contain 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    )
    .trim(),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword is require")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 chars long & should contain 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    )
    .custom((value, { req }) => {
      const password = req.body.password;
      if (value !== password) {
        throw createHttpError("Password dose'nt match");
      }
      return true;
    })
    .trim(),
];

module.exports = registerValidator;
