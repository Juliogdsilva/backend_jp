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
  const { encryptQRcode } = app.src.tools.encrypt;
  const { modelCodes } = app.src.models.codes;

  const generatorCode = async (batchId, batch, number) => {
    const code = {};
    code.code = `JP${batch}AC${number}`;

    code.code = await encryptQRcode(code.code);
    code.batch_id = batchId;
    code.batch_number = number;

    const newCode = await app
      .db('codes')
      .insert(code)
      .then()
      .catch((err) => {
        throw err;
      });

    await app
      .db('log_codes')
      .insert({
        code_id: newCode[0],
        action: 'created',
        description: 'Criado pelo sistema ',
      })
      .then()
      .catch((err) => {
        throw err;
      });

    return true;
  };

  const save = async (req, res) => {
    if (!req.originalUrl.startsWith('/codes')) { return res.status(403).send({ msg: 'Solicitação invalida.' }); }
    if (!req.params.id) return res.status(400).send({ msg: 'Verifique os parâmetro da requisição' });

    const code = await modelCodes(req.body);
    code.id = req.params.id;
    code.status = req.query.st || 'waiting';

    try {
      const existsCode = await app
        .db('codes')
        .where({ id: code.id })
        .whereNull('deleted_at')
        .first();
      notExistsOrError(existsCode, 'Codigo não existente');
    } catch (msg) {
      return res.status(400).send({ msg });
    }

    code.updated_at = new Date();

    app
      .db('codes')
      .update(code)
      .where({ id: code.id })
      .whereNull('deleted_at')
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado' });
        throw err;
      });

    return res.status(204).send();
  };

  const get = async (req, res) => {
    if (!req.originalUrl.startsWith('/codes')) return res.status(403).send({ msg: 'Solicitação invalida.' });

    const currentPage = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;

    const search = req.query.search || false;

    const codes = await app.db('codes as c')
      .select('c.id', 'c.code', 'c.name', 'c.phone', 'c.email', 'c.note', 'c.status', 'c.batch_number as number', 'bt.name as batch')
      .leftJoin('batch as bt', 'bt.id', 'c.batch_id')
      .modify((query) => {
        if (search) {
          // eslint-disable-next-line func-names
          query.andWhere(function () {
            this.where('c.name', 'like', `%${search}%`);
            this.orWhere('c.phone', 'like', `%${search}%`);
            this.orWhere('c.email', 'like', `%${search}%`);
          });
        }
      })
      .paginate({ perPage, currentPage, isLengthAware: true })
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado' });
        throw err;
      });

    return res.status(200).send({ ...codes });
  };

  const getById = async (req, res) => {
    if (!req.originalUrl.startsWith('/codes')) { return res.status(403).send({ msg: 'Solicitação invalida.' }); }
    if (!req.params.id) {
      return res
        .status(400)
        .send({ msg: 'Verifique os parâmetro da requisição' });
    }
    const code = await app.db('codes as c')
      .select('c.*', 'c.batch_number as number', 'bt.name as batch')
      .leftJoin('batch as bt', 'bt.id', 'c.batch_id')
      .where('c.id', req.params.id)
      .first()
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado' });
        throw err;
      });
    return res.status(200).send({ data: code });
  };

  return {
    generatorCode,
    save,
    get,
    getById,
  };
};
