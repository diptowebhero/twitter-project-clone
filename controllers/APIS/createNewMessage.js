const Chat = require("../../models/Chat");
const Messages = require("../../models/Messages");
const User = require("../../models/User");

const createNewMessage = async (req, res, next) => {
  try {
    const chatId = req.params.chatId;
    const userId = req.id;
    const messageObj = req.body;

    let images = req.files || [];

    images = images.map((file) => file.filename);

    const message = Messages({
      sender: userId,
      replyTo: messageObj.replyTo === "null" ? null : messageObj.replyTo,
      chat: chatId,
      message: messageObj.message,
      images,
      gif: messageObj.gif,
      sticker: messageObj.sticker,
    });

    const result = await message.save();
    await User.populate(result, { path: "sender" });
    await Messages.populate(result, { path: "replyTo" });

    await User.populate(result, { path: "replyTo.sender" });
    await Chat.populate(result, { path: "chat" });
    await User.populate(result, { path: "chat.users" });

    //update last messages time
    await Chat.findByIdAndUpdate(chatId, {
      $set: {
        latestMessages: result._id,
      },
    });

    if (result) {
      res.json(result);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    next();
  }
};
module.exports = createNewMessage;
