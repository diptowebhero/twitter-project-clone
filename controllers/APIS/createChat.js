const Chat = require("../../models/Chat");
const User = require("../../models/User");
const { getAndSetCachedData } = require("../../utilities/cacheManager");

const createChat = async (req, res, next) => {
  try {
    const user = await getAndSetCachedData(`users:${req.id}`, async () => {
      const newUser = await User.findOne({ _id: req.id });
      return newUser;
    });

    const users = req.body;
    users.push(user);

    const chat = Chat({
      chatName: "",
      chatImg: "",
      isGroupChat: true,
      users,
      latestMessages: null,
    });
    const result = await chat.save();

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = createChat;
