const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { updateCached } = require("../../utilities/cacheManager");

const createTweet = async (req, res, next) => {
  try {
    const { content } = req.body;

    const tweetObj = {
      content,
      images: [],
      tweetedBy: req.id,
    };

    [...req.files].forEach((file) => {
      tweetObj.images.push(file.filename);
    });

    const tweet = Tweet(tweetObj);
    const result = await tweet.save();
    await User.populate(result, { path: "tweetedBy", select: "-password" });
    updateCached(`posts:${result._id}`, result);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = createTweet;
