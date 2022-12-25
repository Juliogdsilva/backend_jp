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

  const getCounts = async (req, res) => {
    const sellers = await app.db('sellers')
      .count('id as count')
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    const sellersVer = await app.db('sellers_signature')
      .count('id as count')
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    const sellersTra = await app.db('sellers_training')
      .count('id as count')
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    const sellersKits = await app.db('seller_withdrawal')
      .count('id as count')
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    const counts = {
      sellers: sellers[0].count,
      signatures: sellersVer[0].count,
      trainings: sellersTra[0].count,
      kits: sellersKits[0].count,
    };

    res.status(200).send({ counts });
  };

  return {
    getCounts,
  };
};
