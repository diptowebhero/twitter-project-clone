const htmlResponse = (title) => {
  return (req, res, next) => {
    res.locals.html = true;
    res.locals.title = `${title} - ${process.env.APP_NAME}`;
    next();
  };
};

module.exports = htmlResponse;
