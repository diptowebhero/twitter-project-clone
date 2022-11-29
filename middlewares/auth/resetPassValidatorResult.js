const { validationResult } = require("express-validator");

const resetPassValidatorResult = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const mappedError = errors.mapped();
    // console.log(mappedError);
    if (Object.keys(mappedError).length === 0) {
      next();
    } else {
      res.render("pages/auth/resetPassword", {
        error: mappedError,
        user: req.body ? req.body : {},
      });
      next();
    }
  } catch (error) {
    next(error);
  }
};
module.exports = resetPassValidatorResult;
