const createHttpError = require("http-errors");
const User = require("../../models/User");

const emailVerificationController = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const result = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { status: "verified" } },
      { new: true }
    );
    if (result) {
      return res.render("pages/auth/thankYouPage");
    } else {
      next(createHttpError("Internal Server Error"));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = emailVerificationController;
