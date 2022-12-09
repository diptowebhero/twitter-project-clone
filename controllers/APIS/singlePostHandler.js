const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { getAndSetCachedData } = require("../../utilities/cacheManager");
const { postPopulate } = require("../../utilities/postPopulate");

const singlePostHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const result = await getAndSetCachedData(`posts:${postId}`, async () => {
      const newData = await Tweet.findById(postId);
      await postPopulate(newData);
      return newData;
    });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};
module.exports = singlePostHandler;
