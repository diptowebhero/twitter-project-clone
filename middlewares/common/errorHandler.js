const errorHandler = async (err, req, res, next) => {
  try {
    if (res.headersSent) {
      next();
    } else {
      res.locals.error =
        process.env.NODE_ENV === "development" ? err : { message: err.message };

      res.status(err.status || 500);

      if (res.locals.html) {
        //html response
        res.render("errorPage", { title: "Error Page" });
      } else {
        // json response
        res.json(res.locals.error);
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = errorHandler;
