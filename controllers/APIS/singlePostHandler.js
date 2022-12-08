const Tweet = require("../../models/Tweet");
const User = require("../../models/User");

const singlePostHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const result = await Tweet.findById(postId);
    await User.populate(result, { path: "tweetedBy" });
    await Tweet.populate(result, { path: "replyTo" });
    await User.populate(result, { path: "replyTo.tweetedBy" });
    return res.json(result);
  } catch (error) {
    next(error);
  }
};
module.exports = singlePostHandler;
