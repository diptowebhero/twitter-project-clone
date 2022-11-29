const createHttpError = require("http-errors");
const OTP = require("../../models/OTP");

const otpVerificationController = async (req, res, next) => {
  try {
    const otpInput = req.body.otp;
    const otpId = req.body.otpId;
    const otpObj = await OTP.findOne({ _id: otpId });

    if (
      Number(otpInput) === otpObj.OTP &&
      otpObj.expireIn.getTime() > Date.now()
    ) {
      const result = await OTP.findOneAndUpdate(
        { _id: otpId },
        { $set: { status: true } },
        { new: true }
      );
      if (result) {
        res.render("pages/auth/createNewPassword", {
          error: {},
          user: {},
          otp: {
            otp: result.OTP,
            otpId: result._id,
            email: result.email,
          },
        });
      } else {
        throw createHttpError(500, "Internal server error");
      }
    } else {
      const errMsg =
        otpObj.expireIn.getTime() > Date.now()
          ? "Your OTP is invalid"
          : "Your OTP expired";
      console.log(errMsg);
      res.render("pages/auth/verifyOtp", {
        error: { otp: { msg: errMsg } },
        otp: { value: otpInput, otpId: otpId, email: otpObj.email },
      });
    }
  } catch (error) {
    const errMsg =
      otpObj.expireIn > Date.now() ? "Your OTP expired" : "Your OTP is invalid";
    res.render("pages/auth/verifyOtp", {
      error: { otp: errMsg },
      otp: { value: otpInput, otpId: otpId, email: otpObj.email },
    });
  }
};
module.exports = otpVerificationController;
