const createHttpError = require("http-errors");
const User = require("../../models/User");
const pug = require("pug");
const hashPassword = require("../../utilities/hashPassword");
const sendVerificationMail = require("../../utilities/sendVerificationMail");

const registerController = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    const avatarProfile = req?.file?.filename;
    const hashPass = await hashPassword(password);

    const userObj = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashPass,
      avatarProfile,
      status: "unverified",
      likes: [],
    });

    const user = await userObj.save();
    //send verification mail to user
    if (user._id) {
      sendVerificationMail(
        [user.email],
        {
          subject: "Verification mail",
          template: `Verification Link ${process.env.APP_URL}/emailVerification/${user._id}`,
          attachments: [],
        },
        (err, info) => {
          if (!err && info) {
            return res.render("pages/auth/confirmationPage", {
              email: user.email,
              title: "Confirmation - Twitter",
            });
          } else {
            next(createHttpError(500, "Internal Server Error"));
          }
        }
      );
    }
  } catch (error) {
    next(error);
  }
};

module.exports = registerController;
