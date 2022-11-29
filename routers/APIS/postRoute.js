const { Router } = require("express");
const createTweet = require("../../controllers/APIS/createTweet");
const getAllTweet = require("../../controllers/APIS/getAllTweet");
const checkLogin = require("../../controllers/auth/checkLogin");
const tweetImageUploader = require("../../middlewares/APIS/tweetImageUploader");
const postRoute = Router();

postRoute.get("/posts", checkLogin, getAllTweet);

postRoute.post("/posts", checkLogin, tweetImageUploader, createTweet);

module.exports = postRoute;
