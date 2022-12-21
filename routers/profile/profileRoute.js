const { Router } = require("express");
const followHandler = require("../../controllers/APIS/followHandler");
const updateAvatarImgHandler = require("../../controllers/APIS/updateAvatarImgHandler");
const updateAvatarImg = require("../../controllers/APIS/updateAvatarImgHandler");
const updateCoverImgHandler = require("../../controllers/APIS/updateCoverImgHandler");
const checkLogin = require("../../controllers/auth/checkLogin");
const getFollowers = require("../../controllers/getFollowFollowingUsers/getFollowers");
const getFollowing = require("../../controllers/getFollowFollowingUsers/getFollowing");
const getPostProfile = require("../../controllers/profile/getPostProfile");
const getReplyPost = require("../../controllers/profile/getReplyPost");
const updateAvatarImgUpload = require("../../middlewares/APIS/updateAvatarImgUpload");
const updateCoverImgUpload = require("../../middlewares/APIS/updateCoverImgUpload");
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

profileRouter.post(
  "/profile/avatar",
  checkLogin,
  updateAvatarImgUpload,
  updateAvatarImgHandler
);

profileRouter.post(
  "/profile/cover",
  checkLogin,
  updateCoverImgUpload,
  updateCoverImgHandler
);
module.exports = profileRouter;
