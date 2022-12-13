const bcrypt = require('bcrypt-nodejs');

module.exports = () => {
  function encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  return {
    encryptPassword,
  };
};
