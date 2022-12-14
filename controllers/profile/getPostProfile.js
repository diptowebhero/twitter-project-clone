const User = require("../../models/User");
const { getAndSetCachedData } = require("../../utilities/cacheManager");
const getPostProfile = async (req, res, next) => {
  const username = req.params.username;
  const user = await getAndSetCachedData(`users:${req.id}`, async () => {
    const newUser = await User.findOne(
      { username: req.username },
      { password: 0 }
    );
    return newUser;
  });

  const userProfile = await User.findOne({ username });

  const userObj = JSON.stringify(user);
  const userProfileJs = JSON.stringify(userProfile);
  try {
    res.render("pages/profile/profile", {
      error: {},
      user: user,
      userObj,
      userProfileJs,
      userProfile,
      tab: "post",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getPostProfile;
