/* eslint-disable no-unused-vars */
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
  const { modelPermissions } = app.src.models.permissions;

  const save = async (req, res) => {
    if (!req.originalUrl.startsWith('/permissions')) return res.status(403).send({ msg: 'Solicitação invalida.' });

    const permission = await modelPermissions(req.body);

    try {
      existsOrError(permission.name, 'Nome não informado');
      existsOrError(permission.alias, 'Alias não informado');

      const existsClient = await app.db('permissions')
        .where({ name: permission.name }).orWhere({ alias: permission.alias }).first();
      notExistsOrError(existsClient, 'Nome ou Alias em uso');
    } catch (msg) {
      return res.status(400).send({ msg });
    }

    permission.name = permission.name.toLowerCase();

    await app.db('permissions')
      .insert(permission)
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado' });
        throw err;
      });

    return res.status(204).send();
  };

  const get = async (req, res) => {
    if (!req.originalUrl.startsWith('/permissions')) return res.status(403).send({ msg: 'Solicitação invalida.' });

    const currentPage = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;

    const permissions = await app.db('permissions')
      .select()
      .paginate({ perPage, currentPage, isLengthAware: true })
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    return res.status(200).send({ ...permissions });
  };

  return {
    save,
    get,
  };
};
