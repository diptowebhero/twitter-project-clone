const { Router } = require("express");
const checkLogin = require("../../controllers/auth/checkLogin");
const getSearchPost = require("../../controllers/search/getSearchPost");
const getSearchUser = require("../../controllers/search/getSearchUser");
const htmlResponse = require("../../middlewares/common/htmlResponse");
const searchRouter = Router();

searchRouter.get("/search", htmlResponse("Search"), checkLogin, getSearchPost);
searchRouter.get(
  "/search/user",
  htmlResponse("Search"),
  checkLogin,
  getSearchUser
);

module.exports = searchRouter;
