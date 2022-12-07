const { Schema, model } = require("mongoose");

const tweetSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      default: "",
    },
    images: [
      {
        type: String,
      },
    ],
    tweetedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    retweetUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    postData: { type: Schema.Types.ObjectId, ref: "Tweet" },
    replyTo: { type: Schema.Types.ObjectId, ref: "Tweet" },
    replyTweets: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
  },
  { timestamps: true }
);

const Tweet = model("Tweet", tweetSchema);
module.exports = Tweet;
