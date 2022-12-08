const User = require("../../models/User");
const { getAndSetCachedData } = require("../../utilities/cacheManager");
const getSinglePost = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.id;
  const user = await getAndSetCachedData(`users:${req.id}`, async () => {
    const newUser = await User.findOne(
      { username: req.username },
      { password: 0 }
    );
    return newUser;
  });

  const userObj = JSON.stringify(user);
  try {
    res.render("pages/singlePost/postPage", {
      error: {},
      user: user,
      userObj,
      postId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getSinglePost;
