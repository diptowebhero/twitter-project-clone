const { Router } = require("express");
const followHandler = require("../../controllers/APIS/followHandler");
const checkLogin = require("../../controllers/auth/checkLogin");
const getFollowers = require("../../controllers/getFollowFollowingUsers/getFollowers");
const getFollowing = require("../../controllers/getFollowFollowingUsers/getFollowing");
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

profileRouter.put("/profile/:id/follow", checkLogin, followHandler);

// get followers users
profileRouter.get(
  "/profile/:username/followers",
  htmlResponse("Followers"),
  checkLogin,
  getFollowers
);

//get following users
profileRouter.get(
  "/profile/:username/following",
  htmlResponse("Following"),
  checkLogin,
  getFollowing
);
module.exports = profileRouter;
