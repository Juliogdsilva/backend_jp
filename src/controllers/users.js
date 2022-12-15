module.exports = (app) => {
  const {
    existsOrError, notExistsOrError, equalsOrError, notEqualsOrError, isEmailValid, isCPFValid, justNumbers,
  } = app.tools.validation;
  const { encryptPassword, comparePassword } = app.tools.encrypt;
  const modelUser = require('../models/user');

  const save = async (req, res) => {
    const user = await modelUser(req.body);
    const data = { ...req.data };
  };

  return {
    save,
  };
};
