const bcrypt = require('bcrypt-nodejs');

module.exports = () => {
  function encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  function comparePassword(valueA, valueB) {
    const isMatch = bcrypt.compareSync(valueA, valueB);
    if (!isMatch) return false;
    return true;
  }

  return {
    encryptPassword,
    comparePassword,
  };
};
