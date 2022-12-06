const replyHandler = async (req, res, next) => {
  try {
    console.log(req.params.id);
    console.log(req.id);
    console.log(req.body);
    console.log(req.body.files);
    console.log(req.body.content);
  } catch (error) {
    next(error);
  }
};
module.exports = replyHandler;
