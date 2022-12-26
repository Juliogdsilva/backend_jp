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

  const accreditation = async (req, res) => {
    const items = { ...req.body };
    try {
      existsOrError(items.id, 'Código do Ambulante não informado.');
      existsOrError(items.signature, 'Assinatura do Ambulante não informado.');
      existsOrError(items.card, 'Qrcode do Ambulante não informado.');
    } catch (msg) {
      res.status(400).send(msg);
    }

    await app.db('sellers')
      .update({
        name: items.name,
        phone: items.phone,
      })
      .where({ id: items.id })
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    // Assinatura
    let existsSeller = await app.db('sellers_signature')
      .where({ seller_id: items.id }).whereNull('deleted_at').first();

    if (items.signature) {
      if (existsSeller) {
        await app.db('sellers_signature')
          .update({
            seller_id: items.id,
            signature: items.signature,
          })
          .where({ seller_id: items.id })
          .then()
          .catch((err) => {
            res.status(500).send({ msg: 'Erro inesperado', status: true });
            throw err;
          });
      } else {
        await app.db('sellers_signature')
          .insert({
            seller_id: items.id,
            signature: items.signature,
          })
          .then()
          .catch((err) => {
            res.status(500).send({ msg: 'Erro inesperado', status: true });
            throw err;
          });
      }
    }

    // FOTO DAM

    // Assinatura
    existsSeller = await app.db('sellers_dam')
      .where({ seller_id: items.id }).whereNull('deleted_at').first();

    if (items.photo) {
      if (existsSeller) {
        await app.db('sellers_dam')
          .update({
            seller_id: items.id,
            photo: items.photo,
          })
          .where({ seller_id: items.id })
          .then()
          .catch((err) => {
            res.status(500).send({ msg: 'Erro inesperado', status: true });
            throw err;
          });
      } else {
        await app.db('sellers_dam')
          .insert({
            seller_id: items.id,
            photo: items.photo,
          })
          .then()
          .catch((err) => {
            res.status(500).send({ msg: 'Erro inesperado', status: true });
            throw err;
          });
      }
    }

    // Cartão
    existsSeller = await app.db('sellers_card')
      .where({ seller_id: items.id }).whereNull('deleted_at').first();

    if (items.card) {
      if (existsSeller) {
        await app.db('sellers_card')
          .update({
            seller_id: items.id,
            code: items.card,
          })
          .where({ seller_id: items.id })
          .then()
          .catch((err) => {
            res.status(500).send({ msg: 'Erro inesperado', status: true });
            throw err;
          });
      } else {
        await app.db('sellers_card')
          .insert({
            seller_id: items.id,
            code: items.card,
          })
          .then()
          .catch((err) => {
            res.status(500).send({ msg: 'Erro inesperado', status: true });
            throw err;
          });
      }
    }

    res.status(204).send();
  };

  const saveTraining = async (req, res) => {
    const items = { ...req.body };
    try {
      existsOrError(items.id, 'Código do Ambulante não informado.');
      existsOrError(items.training, 'Treinamento do Ambulante não informado.');
    } catch (msg) {
      res.status(400).send(msg);
    }

    await app.db('sellers_training')
      .insert({
        seller_id: items.id,
        training_id: items.training,
      })
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    res.status(204).send();
  };

  const saveKit = async (req, res) => {
    const items = { ...req.body };
    try {
      existsOrError(items.id, 'Código do Ambulante não informado.');
      existsOrError(items.kit, 'Kit do Ambulante não informado.');
    } catch (msg) {
      res.status(400).send(msg);
    }

    const products = await app.db('products')
      .select('*')
      .where({ kit_id: items.kit })
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    products.forEach((product) => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < product.kit_quantity; i++) {
        app.db('sellers_products')
          .insert({
            seller_id: items.id,
            product_id: product.id,
          })
          .then()
          .catch((err) => {
            res.status(500).send({ msg: 'Erro inesperado', status: true });
            throw err;
          });
      }
    });

    await app.db('seller_withdrawal')
      .insert({
        seller_id: items.id,
      })
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    res.status(204).send();
  };

  return {
    blockSeller,
    accreditation,
    saveTraining,
    saveKit,
  };
};
