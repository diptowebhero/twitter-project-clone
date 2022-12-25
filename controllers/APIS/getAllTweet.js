const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { getAndSetCachedData } = require("../../utilities/cacheManager");

const getAllTweet = async (req, res, next) => {
  try {
    const user = await getAndSetCachedData(`users:${req.id}`, async () => {
      const newData = await User.findOne({ _id: req.id });
      return newData;
    });

    //tweetedBy
    const filterObj = {};
    req.query.tweetedBy && (filterObj.tweetedBy = req.query.tweetedBy);

    //reply to
    req.query.replyTo &&
      (filterObj.replyTo =
        req.query.replyTo == "false" ? { $exists: false } : { $exists: true });

    //load only following user post
    user.following = user.following || [];
    const followingUser = [...user.following];
    followingUser.push(user)._id;

    req.query.followingOnly &&
      req.query.followingOnly === true &&
      (filterObj.tweetedBy = { $in: followingUser });

    //get pinned post
    req.query.pinned &&
      req.query.pinned === "true" &&
      (filterObj.pinned = true);

    //search post
    if (req.query.searchText) {
      filterObj.content = { $regex: new RegExp(req.query.searchText, "ig") };
    }

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
