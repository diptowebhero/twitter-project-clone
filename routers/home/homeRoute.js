const { Router } = require("express");
const checkLogin = require("../../controllers/auth/checkLogin");
const getHomePage = require("../../controllers/home/getHomePage");
const htmlResponse = require("../../middlewares/common/htmlResponse");
const homeRouter = Router();

homeRouter.get("/", htmlResponse("Home"), checkLogin, getHomePage);

module.exports = homeRouter;
