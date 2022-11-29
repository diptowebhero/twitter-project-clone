const logoutController = (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/login");
};

module.exports = logoutController;
