const getRegisterPage = async (req, res, next) => {
  try {
    res.render("pages/auth/register", { error: {}, user: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = getRegisterPage;
