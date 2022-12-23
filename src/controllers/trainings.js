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
  const { modelTrainings } = app.src.models.trainings;

  const save = async (req, res) => {
    const training = await modelTrainings(req.body);
    const date = new Date();

    if (req.params.id) training.id = req.params.id;

    try {
      if (!training.id) {
        existsOrError(training.name, 'Nome não informado');
      }
    } catch (msg) {
      return res.status(400).send({ msg });
    }

    if (training.id) {
      training.updated_at = date;
      delete training.created_at;

      app.db('trainings')
        .update(training)
        .where({ id: training.id })
        .then()
        .catch((err) => {
          res.status(500).send({ msg: 'Erro inesperado', status: true });
          throw err;
        });
    } else {
      training.created_at = date;

      await app.db('trainings')
        .insert(training)
        .then()
        .catch((err) => {
          res.status(500).send({ msg: 'Erro inesperado', status: true });
          throw err;
        });
    }
    return res.status(204).send();
  };

  const get = async (req, res) => {
    if (!req.originalUrl.startsWith('/trainings')) return res.status(400).send({ msg: 'Nível de permissão negada!', status: true });

    const currentPage = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;

    const search = req.query.search || false;

    const users = await app.db('trainings')
      .select('*')
      .modify((query) => {
        if (search) {
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
