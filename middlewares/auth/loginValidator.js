const { check } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const { updateCached } = require("../../utilities/cacheManager");

const loginValidator = [
  check("username")
    .notEmpty()
    .withMessage("Username is require")
    .custom(async (value, { req }) => {
      const user = await User.findOne({
        $or: [{ username: value }, { email: value }],
      });
      if (user) {
        req.username = user.username;
        req.email = user.email;
        req.password = user.password;
        req.id = user._id;
        //store data in redis server
        updateCached(`users:${user._id}`, user);
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    })
    .withMessage("User is not found"),

  check("password")
    .notEmpty()
    .withMessage("Password is require")
    .custom(async (password, { req }) => {
      const isMatchPass = await bcrypt.compare(password, req.password);
      if (isMatchPass) {
        req.isValidUser = true;
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    })
    .withMessage("Password is wrong!!"),
];

module.exports = loginValidator;
