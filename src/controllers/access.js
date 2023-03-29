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
  const { decryptQRcode } = app.src.tools.encrypt;
  const { modelCodes } = app.src.models.codes;

  const checkQrcode = async (req, res) => {
    const hash = req.body.code;
    const regexHash = /(\w+)=$/;
    const regexJP = /JP(\w{0,3})AC(\d+)/;

    try {
      existsOrError(hash, 'QrCode não informado');
      existsOrError(regexHash.test(hash), 'Qrcode inválido');

      let code = await decryptQRcode(hash);
      existsOrError(regexJP.test(code), 'Qrcode inválido');
      // const batchName = code.replace(regex, '$1');
      // const number = code.replace(regex, '$2');

      code = await app.db('codes as c')
        .select('c.id', 'c.batch_id', 'bt.name as batch_name', 'c.batch_number', 'c.name', 'c.phone', 'c.email', 'c.note', 'c.status', 'c.created_at', 'c.updated_at')
        .leftJoin('batch as bt', 'bt.id', 'c.batch_id')
        .where('c.code', hash);

      existsOrError(code, 'Codigo não existente');
      return res.status(200).send({ data: code });
    } catch (msg) {
      return res.status(400).send({ msg });
    }
  };

  return {
    checkQrcode,
  };
};
