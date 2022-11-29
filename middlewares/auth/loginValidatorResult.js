const { validationResult } = require("express-validator");
const User = require("../../models/User");

const loginValidatorResult = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const mappedError = errors.mapped(errors);
    // return console.log(mappedError);
    if (Object.keys(mappedError).length === 0) {
      next();
    } else {
      res.render("pages/auth/login", {
        error: mappedError,
        user: req.body ? req.body : {},
      });
      next();
    }
  } catch (error) {
    next(error);
  }
};
module.exports = loginValidatorResult;
