const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const {
  getAndSetCachedData,
  updateCached,
} = require("../../utilities/cacheManager");

const postLikeHandler = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    const user = await getAndSetCachedData(`users:${req.id}`, async () => {
      const newUser = await User.findOne({ _id: req.id });
      return newUser;
    });

    const isLiked = user.likes && user.likes.includes(postId);
    const options = isLiked ? "$pull" : "$addToSet";

    // update post like
    const post = await Tweet.findOneAndUpdate(
      { _id: postId },
      { [options]: { likes: userId } },
      { new: true }
    );
    updateCached(`posts:${postId}`, post);
    // update user like
    const updateUsers = await User.findOneAndUpdate(
      { _id: userId },
      { [options]: { likes: postId } },
      { new: true }
    );
    updateCached(`users:${userId}`, updateUsers);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = postLikeHandler;
