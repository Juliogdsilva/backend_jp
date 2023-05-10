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
  const { compareCode } = app.src.tools.encrypt;
  const { modelCodes } = app.src.models.codes;

  const checkQrcode = async (req, res) => {
    const allCode = req.body.code;
    const regexJP = /(JP\d{1,}AC\d{1,})DC(\w{8})/;

    try {
      existsOrError(allCode, 'QrCode não informado');
      existsOrError(regexJP.test(allCode), 'Qrcode inválido');

      const codeTest = await compareCode(allCode);
      existsOrError(codeTest, 'Qrcode inválido');

      const code = await app.db('codes as c')
        .select('c.id', 'c.batch_id', 'bt.name as batch_name', 'c.batch_number', 'c.name', 'c.phone', 'c.email', 'c.note', 'c.status', 'c.created_at', 'c.updated_at')
        .leftJoin('batch as bt', 'bt.id', 'c.batch_id')
        .where('c.code', allCode)
        .first();

      existsOrError(code, 'Codigo não existente');
      res.status(200).send({ data: code });

      app.db('log_codes')
        .insert({
          code_id: code.id,
          action: 'consulted',
          description: 'Consulta pela checagem',
          created_by: 1,
        })
        .then()
        .catch((err) => {
          throw err;
        });
    } catch (msg) {
      return res.status(400).send({ msg });
    }
    return false;
  };

  const access = async (req, res) => {
    const allCode = req.body.code;
    const regexJP = /(JP\d{1,}AC\d{1,})DC(\w{8})/;

    try {
      existsOrError(allCode, 'QrCode não informado');
      existsOrError(regexJP.test(allCode), 'Qrcode inválido');

      const codeTest = await compareCode(allCode);
      existsOrError(codeTest, 'Qrcode inválido');

      const code = await app.db('codes as c')
        .select('c.id', 'c.batch_id', 'bt.name as batch_name', 'c.batch_number', 'c.name', 'c.phone', 'c.email', 'c.note', 'c.status', 'c.created_at', 'c.updated_at')
        .leftJoin('batch as bt', 'bt.id', 'c.batch_id')
        .where('c.code', allCode)
        .first();

      existsOrError(code, 'Codigo não existente');
      res.status(204).send();

      app.db('log_codes')
        .insert({
          code_id: code.id,
          action: 'consulted',
          description: 'Consulta pela Catraca',
          created_by: 1,
        })
        .then()
        .catch((err) => {
          throw err;
        });
    } catch (msg) {
      return res.status(400).send({ msg });
    }

    return false;
  };

  return {
    checkQrcode,
    access,
  };
};
