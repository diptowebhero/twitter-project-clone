const User = require("../../models/User");
const { getAndSetCachedData } = require("../../utilities/cacheManager");

const getSearchUser = async (req, res, next) => {
  const user = await getAndSetCachedData(`users:${req.id}`, async () => {
    const newUser = await User.findOne(
      { username: req.username },
      { password: 0 }
    );
    return newUser;
  });

  const userObj = JSON.stringify(user);
  try {
    res.render("pages/search/search", {
      error: {},
      user: user ? user : {},
      userObj,
      tab: "users",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = getSearchUser;
