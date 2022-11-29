const jwt = require("jsonwebtoken");
const checkLogin = async (req, res, next) => {
  try {
    if (req.signedCookies.access_token) {
      const token = req.signedCookies.access_token.split(" ")[1];
      const decode = await jwt.verify(token, process.env.JWT_SECRET);

      req.email = decode.email;
      req.username = decode.username;
      req.id = decode._id;
      if (req.originalUrl === "/login" || req.originalUrl === "/register") {
        return res.redirect("/");
      }
      next();
    } else {
      if (req.originalUrl === "/register") {
        return res.render("pages/auth/register", { error: {}, user: {} });
      }
      res.render("pages/auth/login", { error: {}, user: {} });
    }
  } catch (error) {
    if (error.message === "jwt expired") {
      res.render("pages/auth/login", { error: {}, user: {} });
    } else {
      res.render("pages/auth/register", { error: {}, user: {} });
    }
    next(error);
  }
};
module.exports = checkLogin;
