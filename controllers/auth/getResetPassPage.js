const getResetPassPage = async (req, res, next) => {
  try {
    res.render("pages/auth/resetPassword", { error: {}, user: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = getResetPassPage;
