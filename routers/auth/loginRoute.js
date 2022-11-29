const { Router } = require("express");
const checkLogin = require("../../controllers/auth/checkLogin");
const createNewPassController = require("../../controllers/auth/createNewPassController");
const getLoginPage = require("../../controllers/auth/getLoginPage");
const getResetPassPage = require("../../controllers/auth/getResetPassPage");
const loginPageController = require("../../controllers/auth/loginPagecontroller");
const logoutController = require("../../controllers/auth/logoutController");
const otpVerificationController = require("../../controllers/auth/otpVerificationController");
const resetPassController = require("../../controllers/auth/resetPassController");
const loginValidator = require("../../middlewares/auth/loginValidator");
const loginValidatorResult = require("../../middlewares/auth/loginValidatorResult");
const resetPassValidator = require("../../middlewares/auth/resetPassValidator");
const resetPassValidatorResult = require("../../middlewares/auth/resetPassValidatorResult");
const updatePasswordValidator = require("../../middlewares/auth/updatePasswordValidator");
const updatePasswordValidatorResult = require("../../middlewares/auth/updatePasswordValidatorResult");
const htmlResponse = require("../../middlewares/common/htmlResponse");
const loginRoute = Router();

//get login page
loginRoute.get("/login", htmlResponse("Login"), checkLogin, getLoginPage);

//get login handler
loginRoute.post(
  "/login",
  htmlResponse("Login"),
  loginValidator,
  loginValidatorResult,
  loginPageController
);
//Logout handler
loginRoute.get("/logout", logoutController);

// Password reset handler
loginRoute.get(
  "/resetPassword",
  htmlResponse("Reset Password"),
  getResetPassPage
);
loginRoute.post(
  "/resetPassword",
  htmlResponse("Reset Password"),
  resetPassValidator,
  resetPassValidatorResult,
  resetPassController
);
loginRoute.post(
  "/otpVerification",
  htmlResponse("Reset Password"),
  otpVerificationController
);
loginRoute.post(
  "/createNewPass",
  htmlResponse("Create New Password"),
  updatePasswordValidator,
  updatePasswordValidatorResult,
  createNewPassController
);

module.exports = loginRoute;
