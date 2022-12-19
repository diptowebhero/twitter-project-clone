const User = require("../../models/User");
const { getAndSetCachedData } = require("../../utilities/cacheManager");

const getFollowing = async (req, res, next) => {
  try {
    const username = req.params.username;

    const user = await getAndSetCachedData(`users:${req.id}`, async () => {
      const newUser = await User.findOne({ _id: req.id });
      return newUser;
    });

    const userProfile = await User.findOne({ username: username });

    await User.populate(userProfile, { path: "following" });
    await User.populate(userProfile, { path: "followers" });

    const userObj = JSON.stringify(user);
    const userProfileJs = JSON.stringify(userProfile);

    // return console.log(user, userObj, userProfileJs, userProfile);
    return res.render("pages/follow/follow", {
      error: {},
      user: user ? user : {},
      userObj,
      userProfileJs,
      userProfile,
      tab: "following",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getFollowing;
