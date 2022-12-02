const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validator: {
        validate: function (value) {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          );
        },
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validator: {
        validate: function (value) {
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
        },
      },
    },
    avatarProfile: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unverified", "verified", "suspend"],
      default: "unverified",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
    retweets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
  },
  { timestamps: true }
);

const User = model("User", userSchema);
module.exports = User;
