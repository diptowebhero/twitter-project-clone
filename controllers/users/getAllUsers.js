const User = require("../../models/User");

const getAllUsers = async (req, res, next) => {
  try {
    let filterObj = {};
    const searchText = req.query.searchText;
    //search post
    if (req.query.searchText) {
      filterObj = {
        $or: [
          { firstName: new RegExp(req.query.searchText, "ig") },
          { lastName: new RegExp(req.query.searchText, "ig") },
          { username: new RegExp(req.query.searchText, "ig") },
          { email: new RegExp(req.query.searchText, "ig") },
        ],
      };
    }

    const users = await User.find(filterObj);
    res.json(users);
  } catch (error) {
    next(error);
  }
};
module.exports = getAllUsers;
