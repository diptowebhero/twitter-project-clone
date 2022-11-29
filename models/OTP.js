const { Schema, model } = require("mongoose");

const otpSchema = new Schema(
  {
    OTP: {
      type: Number,
      minlength: 4,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    expireIn: {
      type: Date,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const OTP = model("OTP", otpSchema);
module.exports = OTP;
