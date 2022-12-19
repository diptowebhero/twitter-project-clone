const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { getAndSetCachedData } = require("../../utilities/cacheManager");

const getAllTweet = async (req, res, next) => {
  try {
    const user = await getAndSetCachedData(`users:${req.id}`, async () => {
      const newData = await User.findOne({ _id: req.id });
      return newData;
    });

    const filterObj = {};

    req.query.tweetedBy && (filterObj.tweetedBy = req.query.tweetedBy);

    req.query.replyTo &&
      (filterObj.replyTo =
        req.query.replyTo == "false" ? { $exists: false } : { $exists: true });

    user.following = user.following || [];
    const followingUser = [...user.following];
    followingUser.push(user)._id;

    //load only following user post
    req.query.followingOnly &&
      req.query.followingOnly === true &&
      (filterObj.tweetedBy = { $in: followingUser });

    const tweet = await Tweet.find(filterObj);

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
