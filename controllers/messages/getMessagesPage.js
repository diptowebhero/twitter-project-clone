const User = require("../../models/User");
const { getAndSetCachedData } = require("../../utilities/cacheManager");

const getMessagesPage = async (req, res, next) => {
  const user = await getAndSetCachedData(`users:${req.id}`, async () => {
    const newUser = await User.findOne(
      { username: req.username },
      { password: 0 }
    );
    return newUser;
  });

  const userObj = JSON.stringify(user);
  try {
    res.render("pages/messages/messages", {
      error: {},
      user: user ? user : {},
      userObj,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = getMessagesPage;
