const createHttpError = require("http-errors");
const User = require("../../models/User");
const fs = require("fs");
const path = require("path");
const hashPassword = require("../../utilities/hashPassword");
const sendVerificationMail = require("../../utilities/sendVerificationMail");

const registerController = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    const avatarProfile = req?.file?.filename || "";
    const coverImg = req?.file?.filename || "";
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
      retweets: [],
      coverImg: [],
    });

    const user = await userObj.save();

    //make folder for profile image file
    fs.mkdirSync(
      path.join(__dirname, `./../../public/uploads/${user._id}/profile/`),
      { recursive: true }
    );

    //make folder for cover image file
    // fs.mkdirSync(
    //   path.join(__dirname, `./../../public/uploads/${user._id}/cover/`),
    //   { recursive: true }
    // );

    //cut avatar img from temp file to own file
    if (avatarProfile) {
      fs.renameSync(
        path.join(__dirname, `./../../temp/${avatarProfile}`),
        path.join(
          __dirname,
          `./../../public/uploads/${user._id}/profile/${avatarProfile}`
        )
      );
    }

    //cut cover img from temp file to own file
    // if (coverImage) {
    //   fs.renameSync(
    //     path.join(__dirname, `./../../temp/${coverImage}`),
    //     path.join(
    //       __dirname,
    //       `./../../public/uploads/${user._id}/cover/${coverImage}`
    //     )
    //   );
    // }

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
