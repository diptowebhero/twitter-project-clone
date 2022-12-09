const Tweet = require("../models/Tweet");
const User = require("../models/User");

const postPopulate = async (postData) => {
  try {
    await User.populate(postData, { path: "tweetedBy" });
    await Tweet.populate(postData, { path: "replyTo" });
    await Tweet.populate(postData, { path: "replyTo.tweetedBy" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { postPopulate };
