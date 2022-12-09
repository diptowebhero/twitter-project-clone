const Tweet = require("../../models/Tweet");
const { updateCached } = require("../../utilities/cacheManager");
const { postPopulate } = require("../../utilities/postPopulate");

const replyHandler = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const files = req.files;
    const content = req.body.content;
    const postData = {
      content,
      images: [],
      tweetedBy: userId,
      likes: [],
      retweetUsers: [],
      postData: null,
      replyTo: postId,
      replyTweets: [],
    };
    files.forEach((file) => {
      postData.images.push(file.filename);
    });

    const postObj = await Tweet(postData).save();
    const repliedPost = await Tweet.findByIdAndUpdate(
      postId,
      {
        $addToSet: { replyTweets: postObj._id },
      },
      { new: true }
    );
    await postPopulate(postObj);
    await postPopulate(repliedPost);

    updateCached(`posts:${postObj._id}`, postObj);
    updateCached(`posts:${repliedPost._id}`, repliedPost);
    return res.json(postObj);
  } catch (error) {
    next(error);
  }
};
module.exports = replyHandler;
