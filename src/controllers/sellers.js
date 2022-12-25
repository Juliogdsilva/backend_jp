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
  const { modelSellers } = app.src.models.sellers;

  const save = async (req, res) => {
    const seller = await modelSellers(req.body);
    const data = { ...req.body };
    const date = new Date();

    if (req.params.id) seller.id = req.params.id;

    try {
      if (seller.cpf) seller.cpf = await justNumbers(seller.cpf);
      if (!seller.id) {
        existsOrError(seller.cpf, 'CPF não informado');
        isCPFValid(seller.cpf, 'CPF Inválido');
        existsOrError(seller.name, 'Nome não informado');
        existsOrError(seller.phone, 'Telefone não informado');
        existsOrError(seller.dam_number, 'Numero da DAM não informada');
        existsOrError(seller.dam_type, 'Tipo da Dam não informada');
        existsOrError(seller.neighborhood, 'Bairro não informado');

        const existsClient = await app.db('sellers')
          .where({ cpf: seller.cpf }).whereNull('deleted_at').first();
        notExistsOrError(existsClient, 'CPF em uso');
      }
    } catch (msg) {
      return res.status(400).send({ msg });
    }

    if (seller.id) {
      seller.updated_at = date;
      delete seller.created_at;

      app.db('sellers')
        .update(seller)
        .where({ id: seller.id })
        .whereNull('deleted_at')
        .then()
        .catch((err) => {
          res.status(500).send({ msg: 'Erro inesperado', status: true });
          throw err;
        });
    } else {
      seller.created_at = date;

      await app.db('sellers')
        .insert(seller)
        .then()
        .catch((err) => {
          res.status(500).send({ msg: 'Erro inesperado', status: true });
          throw err;
        });
    }
    return res.status(204).send();
  };

  const get = async (req, res) => {
    if (!req.originalUrl.startsWith('/sellers')) return res.status(400).send({ msg: 'Nível de permissão negada!', status: true });

    const currentPage = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;

    const search = req.query.search || false;
    const card = req.query.card || false;

    const sellers = await app.db('sellers as s')
      .select('s.*', 'sd.photo as dam', 'ss.signature', 'sc.code as card', 'st.training_id as training', 'sw.id as kit')
      .modify((query) => {
        // eslint-disable-next-line eqeqeq
        if (search && search != 'null') {
          query.andWhere(function () {
            this.where('s.name', 'like', `%${search}%`);
            this.orWhere('s.cpf', 'like', `%${search}%`);
          });
        }
        // eslint-disable-next-line eqeqeq
        if (card && card != 'null') {
          query.andWhere(function () {
            this.where('sc.code', 'like', `%${card}%`);
          });
        }
      })
      .leftJoin('sellers_dam as sd', 'sd.seller_id', 's.id') // FOTO DAM
      .leftJoin('sellers_signature as ss', 'ss.seller_id', 's.id') // FOTO ASSINATURA
      .leftJoin('sellers_card as sc', 'sc.seller_id', 's.id') // CODE CARTÃO
      .leftJoin('sellers_training as st', 'st.seller_id', 's.id') // ID TREINAMENTO
      .leftJoin('seller_withdrawal as sw', 'sw.seller_id', 's.id') // RETIRADA KIT
      .whereNull('s.deleted_at')
      .paginate({ perPage, currentPage, isLengthAware: true })
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    return res.status(200).send(sellers);
  };

  return {
    save,
    get,
  };
};
