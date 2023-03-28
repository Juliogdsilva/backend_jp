const bcrypt = require('bcrypt-nodejs');
const CryptoJS = require('crypto-js');

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

  function encryptQRcode(qrcode) {
    const encrypted = CryptoJS.DES.encrypt(qrcode, process.env.AUTH_SECRET).toString();
    return encrypted;
  }

  function decryptQRcode(qrcode) {
    const bytes = CryptoJS.DES.decrypt(qrcode, process.env.AUTH_SECRET);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  }

  return {
    encryptPassword,
    comparePassword,
    encryptQRcode,
    decryptQRcode,
  };
};
