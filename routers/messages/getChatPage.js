const createHttpError = require("http-errors");
const User = require("../../models/User");
const { getAndSetCachedData } = require("../../utilities/cacheManager");

const getChatPage = async (req, res, next) => {
  try {
    const chatId = req.params.chatId;
    const user = await getAndSetCachedData(`users:${req.id}`, async () => {
      const newUser = await User.findOne({ _id: req.id });
      return newUser;
    });

    const userObj = JSON.stringify(user);

    res.render("pages/messages/chat", {
      user: user ? user : {},
      userObj,
      chatId,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Internal server error"));
  }
};
module.exports = getChatPage;
