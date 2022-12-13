const createHttpError = require("http-errors");
const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { deleteCache, updateCached } = require("../../utilities/cacheManager");
const { postPopulate } = require("../../utilities/postPopulate");

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    //delete the post
    const deletePost = await Tweet.findOneAndDelete({
      _id: postId,
      tweetedBy: userId,
    });

    if (deletePost !== null) {
      await deleteCache(`posts:${deletePost._id}`);
    } else {
      return next(createHttpError(500, "Bad Request"));
    }

    // return console.log(deletePost);

    //remove the post form the replyTweets array
    if (deletePost?.replyTo) {
      const replyToPost = await Tweet.findByIdAndUpdate(
        { _id: deletePost.replyTo },
        {
          $pull: { replyTweets: postId },
        },
        { new: true }
      );

      if (replyToPost !== null) {
        await postPopulate(replyToPost);
        await updateCached(`posts:${replyToPost?._id}`, replyToPost);
      }
    }

    //remove retweeted post form retweetUsers if the user is a retweeted post
    if (deletePost?.postData) {
      const retweetedPost = await Tweet.findByIdAndUpdate(
        { _id: deletePost?.postData },
        { $pull: { retweetUsers: userId } },
        { new: true },

        await postPopulate(retweetedPost),
        updateCached(`posts:${retweetedPost._id}`, retweetedPost)
      );
    }

    //delete postId from retweets array
    if (deletePost?.retweetUsers?.length) {
      deletePost?.retweetUsers?.forEach(async (uId) => {
        const user = await User.findByIdAndUpdate(
          uId,
          {
            $pull: { retweets: deletePost?._id },
          },
          { new: true }
        );
        await updateCached(`users:${user._id}`, user);
      });
    }

    //delete all retweeted post
    if (deletePost?.retweetUsers?.length) {
      deletePost?.retweetUsers?.forEach(async (uId) => {
        const deleteRetweetedPost = await Tweet.findOneAndDelete(
          {
            postData: deletePost?._id,
            tweetedBy: uId,
          },
          { new: true }
        );
        // console.log(deleteRetweetedPost._id);
        await deleteCache(`posts:${deleteRetweetedPost._id}`);
      });
    }

    //delete post like
    if (deletePost?.likes?.length) {
      deletePost?.likes?.forEach(async (uId) => {
        const user = await User.findByIdAndUpdate(
          uId,
          {
            $pull: { likes: deletePost?._id },
          },
          { new: true }
        );
        await updateCached(`users:${user._id}`, user);
      });
    }
    return res.json(deletePost);
  } catch (error) {
    next(error);
  }
};

module.exports = deletePost;
