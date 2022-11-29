const createHttpError = require("http-errors");

const notFoundHandler = async (req, res, next) => {
  next(createHttpError(404, "Your Requested url is not found"));
};

module.exports = notFoundHandler;
