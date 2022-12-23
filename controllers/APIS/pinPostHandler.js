const Tweet = require("../../models/Tweet");
const {
  getAndSetCachedData,
  updateCached,
} = require("../../utilities/cacheManager");
const { postPopulate } = require("../../utilities/postPopulate");

const pinPostHandler = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    let post = await getAndSetCachedData(`posts:${postId}`, async () => {
      const newData = await Tweet.findOne({ _id: postId });
      return newData;
    });

    if (post.pinned) {
      post = await Tweet.findOneAndUpdate(
        { _id: postId, tweetedBy: userId },
        { $set: { pinned: false } },
        { new: true }
      );

      await postPopulate(post);
      await updateCached(`posts:${post._id}`, post);
    } else {
      const previousPinPost = await Tweet.findOneAndUpdate(
        {
          tweetedBy: userId,
          pinned: true,
        },
        { $set: { pinned: false } },
        { new: true }
      );

      if (previousPinPost) {
        await postPopulate(previousPinPost);
        await updateCached(`posts:${previousPinPost._id}`, previousPinPost);
      }

      post = await Tweet.findByIdAndUpdate(
        { tweetBtn: userId, _id: postId },
        { $set: { pinned: true } },
        { new: true }
      );

      await postPopulate(post);
      await updateCached(`posts:${post._id}`, post);
    }
    res.json(post);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = pinPostHandler;
