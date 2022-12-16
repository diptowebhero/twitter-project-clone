const { Router } = require("express");
const followHandler = require("../../controllers/APIS/followHandler");
const checkLogin = require("../../controllers/auth/checkLogin");
const getPostProfile = require("../../controllers/profile/getPostProfile");
const getReplyPost = require("../../controllers/profile/getReplyPost");
const htmlResponse = require("../../middlewares/common/htmlResponse");
const profileRouter = Router();

profileRouter.get(
  "/profile/:username",
  htmlResponse("Profile"),
  checkLogin,
  getPostProfile
);
profileRouter.get(
  "/profile/:username/replies",
  htmlResponse("Profile"),
  checkLogin,
  getReplyPost
);

profileRouter.put(
  "/profile/:id/follow",
  htmlResponse("Profile"),
  checkLogin,
  followHandler
);

module.exports = profileRouter;
