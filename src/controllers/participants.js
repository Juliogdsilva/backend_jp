/* eslint-disable no-unused-vars */
module.exports = (app) => {
  const {
    existsOrError,
    notExistsOrError,
    equalsOrError,
    notEqualsOrError,
    isEmailValid,
    justNumbers,
  } = app.src.tools.validation;
  const { encryptPassword, comparePassword } = app.src.tools.encrypt;
  const { modelParticipants } = app.src.models.participants;
  const { sendMailWelcome, sendMailComplet } = app.src.controllers.email;

  const save = async (req, res) => {
    const participants = await modelParticipants(req.body);
    const data = { ...req.body };
    const date = new Date();

    if (req.params.id) participants.id = req.params.id;

    try {
      if (!participants.id) {
        existsOrError(participants.first_name, 'Nome não informado');
        existsOrError(participants.last_name, 'Sobrenome não informado');
        existsOrError(participants.email, 'E-mail não informado');
        isEmailValid(participants.email, 'E-mail inválido');
        existsOrError(data.confirmEmail, 'Confirmação de e-mail não informada');
        equalsOrError(participants.email, data.confirmEmail, 'E-mails não conferem');
        const existsClient = await app.db('participants')
          .where({ email: participants.email }).whereNull('deleted_at').first();
        notExistsOrError(existsClient, 'E-mail em uso');
        existsOrError(participants.phone, 'Telefone não informado');
        existsOrError(participants.birthdate, 'Data de nascimento não informada');
        existsOrError(participants.company, 'Empresa não informada');
        existsOrError(participants.document_type, 'Tipo de documento não informado');
        existsOrError(participants.doc_number, 'Numero do documento não informado');
        existsOrError(participants.password, 'Senha não informada');
        existsOrError(participants.registration_fee, 'Opção de pacote não informada');
      }

      if (participants.password) {
        existsOrError(data.confirmPassword, 'Confirmação de senha não informada');
        equalsOrError(participants.password, data.confirmPassword, 'Senhas não conferem');
        participants.password = await encryptPassword(participants.password);
      }
    } catch (msg) {
      return res.status(400).send({ msg });
    }

    if (participants.id) {
      participants.updated_at = date;
      delete participants.created_at;

      app.db('participants')
        .update(participants)
        .where({ id: participants.id })
        .whereNull('deleted_at')
        .then()
        .catch((err) => {
          res.status(500).send({ msg: 'Erro inesperado', status: true });
          throw err;
        });
    } else {
      participants.created_at = date;

      await app.db('participants')
        .insert(participants)
        .then()
        .catch((err) => {
          res.status(500).send({ msg: 'Erro inesperado', status: true });
          throw err;
        });

      sendMailWelcome(participants.email, participants.first_name);
    }
    return res.status(204).send();
  };

  const get = async (req, res) => {
    if (!req.originalUrl.startsWith('/participants')) return res.status(400).send({ msg: 'Nível de permissão negada!', status: true });

    const currentPage = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;

    const search = req.query.search || false;

    const participants = await app.db('participants')
      .select()
      .modify((query) => {
        // eslint-disable-next-line eqeqeq
        if (search && search != 'null') {
          query.andWhere(function () {
            this.where('name', 'like', `%${search}%`);
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

    return res.status(200).send(participants);
  };

  const getById = async (req, res) => {
    if (!req.originalUrl.startsWith('/participants')) return res.status(400).send({ msg: 'Nível de permissão negada!', status: true });
    if (!req.params.id) return res.status(400).send({ msg: 'Código do Usuário não informado.', status: true });

    const participant = await app.db('participants')
      .select('id', 'first_name', 'last_name', 'email', 'phone', 'phone', 'birthdate', 'company', 'companion', 'document_type', 'doc_number', 'special_needs', 'special_needs_describe', 'arrival_date', 'arrival_time', 'departure_date', 'departure_time', 'flight_number', 'flight_number_departure', 'have_allergy', 'allergy')
      .where({ id: req.params.id })
      .whereNull('deleted_at')
      .first()
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    return res.status(200).send(participant);
  };

  const activeParticipants = async (req, res) => {
    if (!req.originalUrl.startsWith('/active')) return res.status(400).send({ msg: 'Nível de permissão negada!', status: true });
    if (!req.params.id) return res.status(400).send({ msg: 'Código do Usuário não informado.', status: true });

    const participant = await app.db('participants')
      .select('id', 'first_name', 'email')
      .first()
      .where({ id: req.params.id })
      .whereNull('deleted_at');

    if (!participant) return res.status(400).send({ msg: 'Participante não encontrado!', status: true });

    participant.status = 'ative';
    participant.updated_at = new Date();

    sendMailComplet(...participant);

    delete participant.id;
    await app.db('participants')
      .update(participant)
      .where({ id: req.params.id })
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    return res.status(200).send();
  };

  return {
    save,
    get,
    getById,
    activeParticipants,
  };
};
