const { validationResult } = require("express-validator");

const updatePasswordValidatorResult = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
      next();
    } else {
      res.render("pages/auth/createNewPassword", {
        error: mappedErrors,
        user: {},
        otp: {
          otpId: req.body.otpId,
          otp: req.body.otp,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
module.exports = updatePasswordValidatorResult;
