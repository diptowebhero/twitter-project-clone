const getLoginPage = async (req, res, next) => {
  try {
    res.render("pages/auth/login", { error: {}, user: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = getLoginPage;
