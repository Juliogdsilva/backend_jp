const bcrypt = require('bcrypt-nodejs');
const CryptoJS = require('crypto');

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

  function encryptCode(code) {
    let encrypted = CryptoJS.createHmac('sha256', process.env.AUTH_SECRET)
      .update(code)
      .digest('hex');
    const regex = /(\w{3})(\w{8})(\w+)/;
    encrypted = encrypted.replace(regex, '$2');
    return encrypted;
  }

  function compareCode(allCode) {
    let isAuthentic = false;
    const regexCode = /(JP\d{1,}AC\d{1,})DC(\w{8})/;
    const regexCrypt = /(\w{3})(\w{8})(\w+)/;
    const code = allCode.replace(regexCode, '$1');
    const hash = allCode.replace(regexCode, '$2');
    let encrypted = CryptoJS.createHmac('sha256', process.env.AUTH_SECRET)
      .update(code)
      .digest('hex');
    encrypted = encrypted.replace(regexCrypt, '$2');
    isAuthentic = encrypted === hash;

    return isAuthentic;
  }

  return {
    encryptPassword,
    comparePassword,
    encryptCode,
    compareCode,
  };
};
