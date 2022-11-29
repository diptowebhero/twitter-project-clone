const { check } = require("express-validator");
const User = require("../../models/User");

const resetPassValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is require")
    .custom(async (value, { req }) => {
      //   console.log(value);
      const user = await User.findOne(
        {
          $or: [{ username: req.body.username }, { email: req.body.email }],
        },
        { email: 1 }
      );
      if (user) {
        req.isValidUser = true;
        req.email = user.email;
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    })
    .withMessage("Email not found"),
];
module.exports = resetPassValidator;
