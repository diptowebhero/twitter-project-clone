const User = require("../../models/User");
const {
  getAndSetCachedData,
  updateCached,
} = require("../../utilities/cacheManager");

const followHandler = async (req, res, next) => {
  try {
    const followingUserId = req.params.id;
    const loggedInUserId = req.id;

    const user = await getAndSetCachedData(
      `users:${loggedInUserId}`,
      async () => {
        const newData = await User.findOne({ _id: loggedInUserId });
        return newData;
      }
    );

    const isFollowing =
      user.following && user.following.includes(followingUserId);

    const options = isFollowing ? "$pull" : "$addToSet";

    //update following array list
    const modiFiedLoggedInUser = await User.findOneAndUpdate(
      { _id: loggedInUserId },
      { [options]: { following: followingUserId } },
      { new: true }
    );
    updateCached(`users:${loggedInUserId}`, modiFiedLoggedInUser);
    //   console.log(modiFiedLoggedInUser);

    //update followers array list
    const modiFiedFollowingsUser = await User.findOneAndUpdate(
      { _id: followingUserId },
      { [options]: { followers: loggedInUserId } },
      { new: true }
    );

    updateCached(`users:${followingUserId}`, modiFiedFollowingsUser);

    return res.json(modiFiedFollowingsUser);
  } catch (error) {
    next(error);
  }
};
module.exports = followHandler;
