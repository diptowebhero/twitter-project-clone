const User = require("../../models/User");
const { updateCached } = require("../../utilities/cacheManager");

const updateAvatarImgHandler = async (req, res, next) => {
  try {
    const filename = req.files[0].filename;
    const user = await User.findOneAndUpdate(
      { _id: req.id },
      { $set: { avatarProfile: filename } },
      { new: true }
    );

    updateCached(`users:${req.id}`, user);
    res.send(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = updateAvatarImgHandler;
