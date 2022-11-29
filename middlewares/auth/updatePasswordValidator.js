const { check } = require("express-validator");
const createHttpError = require("http-errors");

const updatePasswordValidator = [
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
    .custom((value, { req }) => {
      const password = req.body.password;
      if (value !== password) {
        throw createHttpError("Password dose'nt match");
      }
      return true;
    })
    .trim(),
];
module.exports = updatePasswordValidator;
