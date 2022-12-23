const { Router } = require("express");
const createTweet = require("../../controllers/APIS/createTweet");
const deletePost = require("../../controllers/APIS/deletePost");
const getAllTweet = require("../../controllers/APIS/getAllTweet");
const pinPostHandler = require("../../controllers/APIS/pinPostHandler");
const postLikeHandler = require("../../controllers/APIS/postLikeHandler");
const postRetweetHandler = require("../../controllers/APIS/postRetweetHandler");
const replyHandler = require("../../controllers/APIS/replyHandler");
const singlePostHandler = require("../../controllers/APIS/singlePostHandler");
const checkLogin = require("../../controllers/auth/checkLogin");
const getSinglePost = require("../../controllers/singlePost/getSinglePost");
const tweetImageUploader = require("../../middlewares/APIS/tweetImageUploader");
const postRoute = Router();

postRoute.get("/posts", checkLogin, getAllTweet);
postRoute.get("/posts/:id", checkLogin, getSinglePost);

postRoute.delete("/posts/:id", checkLogin, deletePost);

postRoute.get("/posts/singlePost/:postId", checkLogin, singlePostHandler);

postRoute.post("/posts", checkLogin, tweetImageUploader, createTweet);

postRoute.put("/posts/like/:id", checkLogin, postLikeHandler);

postRoute.post("/posts/retweet/:id", checkLogin, postRetweetHandler);

postRoute.post(
  "/posts/reply/:id",
  checkLogin,
  tweetImageUploader,
  replyHandler
);

//pin route handler
postRoute.put("/posts/:id/pin", checkLogin, pinPostHandler);

module.exports = postRoute;
