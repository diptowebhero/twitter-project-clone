const Tweet = require("../../models/Tweet");
const User = require("../../models/User");

const getAllTweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.find();
    await User.populate(tweet, { path: "tweetedBy", select: "-password" });
    return res.json(tweet);
  } catch (error) {
    next(error);
  }
};
module.exports = getAllTweet;
