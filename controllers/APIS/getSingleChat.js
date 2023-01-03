const { default: mongoose } = require("mongoose");
const Chat = require("../../models/Chat");
const User = require("../../models/User");

const getSingleChat = async (req, res, next) => {
  try {
    const chatId = req.params.chatId;
    const userId = req.id;

    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).json({ error: "Chat dose not exist" });
    }

    const result = await Chat.findOne({
      _id: chatId,
      users: {
        $elemMatch: {
          $eq: userId,
        },
      },
    }).populate("users");

    // return console.log(result);
    if (!result) {
      //if chatId is userId
      const userFound = await User.findById(chatId);
      // return console.log(userFound);
      if (userFound) {
        const privateChatData = await Chat.findOneAndUpdate(
          {
            isGroupChat: false,
            users: {
              $size: 2,
              $all: [
                {
                  $elemMatch: {
                    $eq: mongoose.Types.ObjectId(chatId),
                  },
                },
                {
                  $elemMatch: {
                    $eq: mongoose.Types.ObjectId(userId),
                  },
                },
              ],
            },
          },
          {
            $setOnInsert: {
              users: [userId, chatId],
            },
          },
          {
            new: true,
            upsert: true,
          }
        ).populate("users");

        // return console.log(privateChatData);
        if (privateChatData) {
          return res.json(privateChatData);
        } else {
          return res.status(500).json({ error: "internal server error" });
        }
      } else {
        return res.status(400).json({
          error: "Chat is doesn't exist or you don't have access to it",
        });
      }
    }

    return res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = getSingleChat;
