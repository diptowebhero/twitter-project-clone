const { Router } = require("express");
const createTweet = require("../../controllers/APIS/createTweet");
const getAllTweet = require("../../controllers/APIS/getAllTweet");
const postLikeHandler = require("../../controllers/APIS/postLikeHandler");
const checkLogin = require("../../controllers/auth/checkLogin");
const tweetImageUploader = require("../../middlewares/APIS/tweetImageUploader");
const postRoute = Router();

postRoute.get("/posts", checkLogin, getAllTweet);

postRoute.post("/posts", checkLogin, tweetImageUploader, createTweet);

postRoute.put("/posts/like/:id", checkLogin, postLikeHandler);

module.exports = postRoute;
