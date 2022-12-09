const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { updateCached } = require("../../utilities/cacheManager");
const { postPopulate } = require("../../utilities/postPopulate");

const postRetweetHandler = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    const deletedPost = await Tweet.findOneAndDelete({
      tweetedBy: userId,
      postData: postId,
    });

    let retweetObj = deletedPost;

    if (retweetObj === null) {
      const tweet = Tweet({
        tweetedBy: userId,
        postData: postId,
      });

      retweetObj = await tweet.save();
      updateCached(`posts:${retweetObj._id}`, tweet);
    }

    const option = deletedPost !== null ? "$pull" : "$addToSet";

    //update post
    const post = await Tweet.findOneAndUpdate(
      {
        _id: postId,
      },
      { [option]: { retweetUsers: userId } },
      { new: true }
    );
    await postPopulate(post);
    await updateCached(`posts:${postId}`, post);

    //update user
    const modifiedUser = await User.findOneAndUpdate(
      { _id: userId },
      { [option]: { retweets: postId } },
      { new: true }
    );
    updateCached(`users:${userId}`, modifiedUser);

    return res.json(post);
  } catch (error) {
    next(error);
  }
};
module.exports = postRetweetHandler;
