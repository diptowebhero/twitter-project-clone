const bcrypt = require("bcrypt");
const hashPassword = (str) => {
  return bcrypt.hash(str, 10);
};

module.exports = hashPassword;
