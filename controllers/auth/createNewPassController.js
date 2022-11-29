const createHttpError = require("http-errors");
const OTP = require("../../models/OTP");
const User = require("../../models/User");
const hashPassword = require("../../utilities/hashPassword");
const jwt = require("jsonwebtoken");
const createNewPassController = async (req, res, next) => {
  try {
    const password = await hashPassword(req.body.password);
    const otpInp = req.body.otp;
    const otpId = req.body.otpId;
    const otpObj = await OTP.findOne({ _id: otpId });

    if (Number(otpInp) === otpObj.OTP && otpObj.status) {
      const result = await User.findOneAndUpdate(
        { email: otpObj.email },
        { $set: { password } },
        { new: true }
      );
      if (result) {
        const token = jwt.sign(
          {
            email: result.email,
            username: result.username,
            _id: result._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.cookie("access_token", "Bearer " + token, {
          signed: true,
          httpOnly: true,
          secure: true,
        });
        res.status(200);
        res.redirect("/");
      } else {
        throw createHttpError(500, "Internal Server Error");
      }
    } else {
      throw createHttpError(500, "Internal Server Error");
    }
  } catch (error) {
    next(error);
  }
};
module.exports = createNewPassController;
