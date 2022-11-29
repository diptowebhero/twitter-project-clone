const { validationResult } = require("express-validator");

const registerValidatorResult = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const mappedError = errors.mapped();
    if (Object.keys(mappedError).length === 0) {
      next();
    } else {
      res.render("pages/auth/register", {
        error: mappedError,
        user: req.body ? req.body : {},
      });
      next();
    }
  } catch (error) {
    next(error);
  }
};
module.exports = registerValidatorResult;
