const path = require("path");
const filename = path.join(__dirname + `./../../temp/`);

chatImage
  ? `<img style='width:40px;height:40px;display:block' src='${chatImage}' alt='Avatar'>`
  : otherUsers.length === 1
  ? `<img style='width:40px;height:40px;display:block' src='${
      otherUsers[0].avatarProfile
        ? "/uploads/" +
          otherUsers[0]._id +
          "/profile/" +
          otherUsers[0].avatarProfile
        : "/uploads/profile/avatar.png"
    }'>`
  : `<img style='width:40px;height:40px;display:block' src='${
      otherUsers[0].avatarProfile
        ? "/uploads/" +
          otherUsers[0]._id +
          "/profile/" +
          otherUsers[0].avatarProfile
        : "/uploads/profile/avatar.png"
    }'> <img style='width:40px;height:40px;display:block' src='${
      otherUsers[otherUsers.length - 1].avatarProfile
        ? "/uploads/" +
          otherUsers[otherUsers.length - 1]._id +
          "/profile/" +
          otherUsers[otherUsers.length - 1].avatarProfile
        : "/uploads/profile/avatar.png"
    }'>
        ${remainingUsers}`;
