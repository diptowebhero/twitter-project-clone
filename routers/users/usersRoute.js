const { Router } = require("express");
const checkLogin = require("../../controllers/auth/checkLogin");
const getAllUsers = require("../../controllers/users/getAllUsers");
const htmlResponse = require("../../middlewares/common/htmlResponse");
const userRouter = Router();

userRouter.get("/users", htmlResponse("Users"), checkLogin, getAllUsers);
module.exports = userRouter;
