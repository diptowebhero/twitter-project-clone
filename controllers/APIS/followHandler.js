const User = require("../../models/User");
const {
  getAndSetCachedData,
  updateCached,
} = require("../../utilities/cacheManager");

const followHandler = async (req, res, next) => {
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

  //   console.log(isFollowing);
  const options = isFollowing ? "$pull" : "$addToSet";

  //update loggedInUser following array
  const modiFiedLoggedInUser = await User.findOneAndUpdate(
    { _id: loggedInUserId },
    { [options]: { following: followingUserId } },
    { new: true }
  );
  updateCached(`users:${loggedInUserId}`, modiFiedLoggedInUser);
  //   console.log(modiFiedLoggedInUser);

  //update followers array who i will follow
  const modiFiedFollowingUser = await User.findOneAndUpdate(
    { _id: loggedInUserId },
    { [options]: { followers: loggedInUserId } },
    { new: true }
  );
  //   console.log(modiFiedFollowingUser);

  updateCached(`users:${loggedInUserId}`, modiFiedFollowingUser);

  return res.json(modiFiedFollowingUser);
};
module.exports = followHandler;
