const jwt = require("jsonwebtoken");
const loginPageController = async (req, res, next) => {
  try {
    if (req.isValidUser) {
      const token = jwt.sign(
        {
          email: req.email,
          username: req.username,
          _id: req.id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("access_token", "Bearer " + token, {
        signed: true,
        httpOnly: true,
        secure: true,
      });
      res.status(200);
      res.redirect("/");
    } else {
      res.render("Internal server error");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = loginPageController;
