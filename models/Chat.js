const { Schema, model, default: mongoose } = require("mongoose");

const chatSchema = new Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    chatImg: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessages: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Chat = model("Chat", chatSchema);
module.exports = Chat;
