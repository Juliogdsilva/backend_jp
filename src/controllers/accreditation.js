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

  const blockSeller = async (req, res) => {
    if (!req.originalUrl.startsWith('/block_seller')) return res.status(400).send({ msg: 'Nível de permissão negada!', status: true });

    const seller = {};

    try {
      existsOrError(req.params.id, 'Código do Ambulante não informado.');
      existsOrError(req.user.id, 'Código do usuário não informado.');
      seller.seller_id = req.params.id;
      seller.user_id = req.user.id;
    } catch (msg) {
      res.status(400).send(msg);
    }

    const existsBlock = await app.db('sellers_block')
      .where({ seller_id: seller.seller_id }).whereNull('deleted_at').first();
    if (existsBlock) return res.status(204).send({ block: true });

    app.db('sellers_block')
      .insert(seller)
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    return res.status(204).send({ block: true });
  };

  const accreditation = (req, res) => { };

  return {
    blockSeller,
    accreditation,
  };
};
