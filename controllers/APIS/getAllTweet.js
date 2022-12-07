const Tweet = require("../../models/Tweet");
const User = require("../../models/User");

const getAllTweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.find();
    await User.populate(tweet, { path: "tweetedBy", select: "-password" });

    await Tweet.populate(tweet, { path: "postData" });
    await User.populate(tweet, { path: "postData.tweetedBy" });
    await Tweet.populate(tweet, { path: "replyTo" });
    await User.populate(tweet, { path: "replyTo.tweetedBy" });
    // return console.log(tweet);
    return res.json(tweet);
  } catch (error) {
    next(error);
  }
};
module.exports = getAllTweet;
