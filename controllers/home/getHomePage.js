const User = require("../../models/User");
const { getAndSetCachedData } = require("../../utilities/cacheManager");
const getHomePage = async (req, res, next) => {
  const user = await getAndSetCachedData(`users:${req.id}`, async () => {
    const newUser = await User.findOne(
      { username: req.username },
      { password: 0 }
    );
    return newUser;
  });

  const userObj = JSON.stringify(user);
  try {
    res.render("pages/home/home", { error: {}, user: user, userObj });
  } catch (error) {
    next(error);
  }
};
module.exports = getHomePage;
