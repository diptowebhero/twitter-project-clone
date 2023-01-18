const { Schema, model } = require("mongoose");
const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
    message: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    gif: Object,
    sticker: Object,
    seenBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reactBy: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        emoji: Object,
      },
    ],
  },
  { timestamps: true }
);

const Messages = model("Message", messageSchema);
module.exports = Messages;
