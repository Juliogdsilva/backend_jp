module.exports = (app) => {
  const {
    existsOrError,
    notExistsOrError,
    equalsOrError,
    notEqualsOrError,
    isEmailValid,
    isCPFValid,
    justNumbers,
  } = app.src.tools.validation;
  const { modelTrainings } = app.src.models.trainings;

  const userPermissions = async (req, res) => {

  };

  const get = async (req, res) => {
    const permissions = await app.db('permissions')
      .select('*')
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    return res.status(200).send({ permissions });
  };

  return {
    userPermissions,
    get,
  };
};
