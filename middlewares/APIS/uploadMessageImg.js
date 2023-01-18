const upload = require("multer-uploader");
const path = require("path");
const uploadMessageImg = async (req, res, next) => {
  try {
    // absolute path of your upload directory
    const upload_dir = path.join(
      __dirname,
      `./../../public/uploads/${req.params.chatId}/profile/`
    ); // absolute path
    // max file size in bytes
    const max_file_size = 1000000; // bytes
    // allowed file types in Array
    const allowed_file_mime_type = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/svg+xml",
    ]; // mime types Array

    const uploader = upload(
      upload_dir,
      max_file_size,
      allowed_file_mime_type
    ).any();

    uploader(req, res, (err) => {
      if (err) {
        next(err);
      } else {
        next();
      }
    });
  } catch (error) {
    next(error);
  }
};
module.exports = uploadMessageImg;
