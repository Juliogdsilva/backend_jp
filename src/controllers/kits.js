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
  const { modelKits } = app.src.models.kits;

  const save = async (req, res) => {
    const kit = await modelKits(req.body);
    const date = new Date();

    if (req.params.id) kit.id = req.params.id;

    try {
      if (!kit.id) {
        existsOrError(kit.name, 'Nome não informado');
        // existsOrError(kit.type, 'Tipo não informado');
        existsOrError(kit.quantity, 'Quantidade não informado');
      }
    } catch (msg) {
      return res.status(400).send({ msg });
    }

    if (kit.id) {
      kit.updated_at = date;
      delete kit.created_at;

      app.db('kits')
        .update(kit)
        .where({ id: kit.id })
        .then()
        .catch((err) => {
          res.status(500).send({ msg: 'Erro inesperado', status: true });
          throw err;
        });
    } else {
      kit.created_at = date;

      await app.db('kits')
        .insert(kit)
        .then()
        .catch((err) => {
          res.status(500).send({ msg: 'Erro inesperado', status: true });
          throw err;
        });
    }
    return res.status(204).send();
  };

  const get = async (req, res) => {
    if (!req.originalUrl.startsWith('/kits')) return res.status(400).send({ msg: 'Nível de permissão negada!', status: true });

    const currentPage = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;

    const search = req.query.search || false;

    const users = await app.db('kits')
      .select('*')
      .modify((query) => {
        // eslint-disable-next-line eqeqeq
        if (search && search != 'null') {
          query.andWhere(function () {
            this.where('name', 'like', `%${search}%`);
          });
        }
      })
      .paginate({ perPage, currentPage, isLengthAware: true })
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    return res.status(200).send(users);
  };

  return {
    save,
    get,
  };
};
