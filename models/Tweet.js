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
  },
  { timestamps: true }
);

const Tweet = model("Tweet", tweetSchema);
module.exports = Tweet;
