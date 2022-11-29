const { Router } = require("express");
const checkLogin = require("../../controllers/auth/checkLogin");
const emailVerificationController = require("../../controllers/auth/emailVerificationController");
const getRegisterPage = require("../../controllers/auth/getRegisterPage");
const registerController = require("../../controllers/auth/registerController");
const avatarUploader = require("../../middlewares/auth/avatarUploader");
const registerValidator = require("../../middlewares/auth/registerValidator");
const registerValidatorResult = require("../../middlewares/auth/registerValidatorResult");
const htmlResponse = require("../../middlewares/common/htmlResponse");
const registerRoute = Router();

//get login page
registerRoute.get(
  "/register",
  htmlResponse("Register"),
  checkLogin,
  getRegisterPage
);

//register page handler
registerRoute.post(
  "/register",
  htmlResponse("Register"),
  avatarUploader,
  registerValidator,
  registerValidatorResult,
  registerController
);

//email confirmation handler
registerRoute.get(
  "/emailVerification/:id",
  htmlResponse("emailVerification"),
  emailVerificationController
);
registerRoute.get(
  "/emailVerification/:id",
  htmlResponse("emailVerification"),
  emailVerificationController
);
module.exports = registerRoute;
