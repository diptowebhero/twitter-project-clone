const upload = require("multer-uploader");
const path = require("path");
const avatarUploader = async (req, res, next) => {
  try {
    // absolute path of your upload directory
    const upload_dir = path.join(__dirname, "./../../public/uploads/profile/");
    // max file size in bytes, such as 1MB equal 1000000 bytes
    const max_file_size = 1000000; // bytes
    // allowed file types in Array
    const allowed_file_mime_type = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "images/svg+xml",
    ]; // mime types Array

    const uploader = upload(
      upload_dir,
      max_file_size,
      allowed_file_mime_type
    ).single("avatarProfile");
    uploader(req, res, (err) => {
      if (err) {
        const error = {
          avatarProfile: {
            msg: err.message,
          },
        };
        res.render("pages/auth/register", { error: error });
      } else {
        next();
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = avatarUploader;
