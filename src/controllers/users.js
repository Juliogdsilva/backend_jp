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
  const { encryptPassword, comparePassword } = app.src.tools.encrypt;
  const { modelUser } = app.src.models.users;

  const save = async (req, res) => {
    const user = await modelUser(req.body);
    const data = { ...req.body };
    const date = new Date();

    if (req.params.id) user.id = req.params.id;

    try {
      if (!user.id) {
        existsOrError(user.email, 'E-mail não informado');
        // isCPFValid(user.cpf, 'CPF Inválido');
        existsOrError(user.name, 'Nome não informado');
        existsOrError(user.password, 'Senha não informada');

        const existsClient = await app.db('users')
          .where({ email: user.email }).whereNull('deleted_at').first();
        notExistsOrError(existsClient, 'E-mail em uso');
      }

      if (user.password) {
        existsOrError(data.confirmPassword, 'Confirmação de senha não informada');
        equalsOrError(user.password, data.confirmPassword, 'Senhas não conferem');
        user.password = await encryptPassword(user.password);
      }
    } catch (msg) {
      return res.status(400).send({ msg });
    }

    if (user.id) {
      user.updated_at = date;
      delete user.created_at;

      app.db('users')
        .update(user)
        .where({ id: user.id })
        .whereNull('deleted_at')
        .then()
        .catch((err) => {
          res.status(500).send({ msg: 'Erro inesperado', status: true });
          throw err;
        });
    } else {
      user.created_at = date;

      await app.db('users')
        .insert(user)
        .then()
        .catch((err) => {
          res.status(500).send({ msg: 'Erro inesperado', status: true });
          throw err;
        });
    }
    return res.status(204).send();
  };

  const get = async (req, res) => {
    if (!req.originalUrl.startsWith('/users')) return res.status(400).send({ msg: 'Nível de permissão negada!', status: true });

    const currentPage = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;

    const search = req.query.search || false;

    const users = await app.db('users')
      .select('*')
      .modify((query) => {
        // eslint-disable-next-line eqeqeq
        if (search && search != 'null') {
          query.andWhere(function () {
            this.where('name', 'like', `%${search}%`);
            this.orWhere('cpf', 'like', `%${search}%`);
            this.orWhere('email', 'like', `%${search}%`);
          });
        }
      })
      .whereNull('deleted_at')
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
