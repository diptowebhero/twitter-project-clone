const OTP = require("../../models/OTP");
const sendVerificationMail = require("../../utilities/sendVerificationMail");

const resetPassController = async (req, res, next) => {
  try {
    if (req.isValidUser) {
      const otpObj = new OTP({
        OTP: Math.floor(1000 + Math.random() * 9000),
        email: req.email,
        expireIn: Date.now() + 120010,
      });

      const otp = await otpObj.save();
      sendVerificationMail(
        [otp.email],
        {
          subject: "Verification OTP",
          template: `Your OTP is ${otp.OTP}`,
          attachments: [],
        },
        (err, info) => {
          if (!err && info.messageId) {
            res.render("pages/auth/verifyOtp", {
              error: {},
              otp: { value: null, otpId: otp._id, email: otp.email },
            });
          } else {
            res.send("something went wrong");
          }
        }
      );
    }
  } catch (error) {
    next(error);
  }
};

module.exports = resetPassController;
