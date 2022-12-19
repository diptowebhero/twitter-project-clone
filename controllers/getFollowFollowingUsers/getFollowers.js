const User = require("../../models/User");
const { getAndSetCachedData } = require("../../utilities/cacheManager");

const getFollowers = async (req, res, next) => {
  try {
    const username = req.params.username;

    const user = await getAndSetCachedData(`users:${req.id}`, async () => {
      const newData = await User.findOne({ _id: req.id });
      return newData;
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
      tab: "followers",
    });
  } catch (error) {
    console.log(console.log(error));
    next(error);
  }
};

module.exports = getFollowers;
