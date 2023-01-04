const { getAndSetCachedData } = require("../../utilities/cacheManager");
const { User } = require("../../models/User");
const { mongoose } = require("mongoose");
const Chat = require("../../models/Chat");

const getAllChat = async (req, res, next) => {
  try {
    const user = await getAndSetCachedData(`users:${req.id}`, async () => {
      const newUser = await User.findOne({ _id: req.id });
      return newUser;
    });
    const filterObj = {};

    filterObj.users = {
      $elemMatch: { $eq: mongoose.Types.ObjectId(user._id) },
    };

    const result = await Chat.find(filterObj)
      .sort({ updatedAt: "-1" })
      .populate("users");

    // await Chat.populate(result, { path: "users" });

    return res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getAllChat;
