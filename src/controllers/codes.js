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
  const { encryptCode } = app.src.tools.encrypt;
  const { modelCodes } = app.src.models.codes;

  const generatorCode = async (batchId, number) => {
    const model = `JP${batchId}AC${number}`;
    const hash = await encryptCode(model);

    const code = {
      batch_id: batchId,
      batch_number: number,
      code: `${model}DC${hash}`,
    };

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

  const activeCode = async (req, res) => {
    if (!req.originalUrl.startsWith('/active_code')) { return res.status(403).send({ msg: 'Solicitação invalida.' }); }

    const code = await modelCodes(req.body);
    code.id = req.body.id;
    code.status = 'ative';
    code.updated_at = new Date();

    if (!code.id) {
      return res
        .status(400)
        .send({ msg: 'Verifique os parâmetro da requisição' });
    }

    try {
      const existsCode = await app
        .db('codes')
        .where({ id: code.id })
        .first();
      existsOrError(existsCode, 'Codigo não existente');
    } catch (msg) {
      return res.status(400).send({ msg });
    }

    app
      .db('codes')
      .update(code)
      .where({ id: code.id })
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado' });
        throw err;
      });

    app.db('log_codes')
      .insert({
        code_id: code.id,
        action: 'activated',
        description: 'Ativação de código',
        created_by: 1,
      })
      .then()
      .catch((err) => {
        throw err;
      });

    return res.status(204).send();
  };

  const deactiveCode = async (req, res) => {
    if (!req.originalUrl.startsWith('/deactive_code')) { return res.status(403).send({ msg: 'Solicitação invalida.' }); }

    const code = await modelCodes(req.body);
    code.id = req.body.id;
    code.status = 'blocked';
    code.updated_at = new Date();

    if (!code.id) {
      return res
        .status(400)
        .send({ msg: 'Verifique os parâmetro da requisição' });
    }

    try {
      const existsCode = await app
        .db('codes')
        .where({ id: code.id })
        .first();
      existsOrError(existsCode, 'Codigo não existente');
    } catch (msg) {
      return res.status(400).send({ msg });
    }

    app
      .db('codes')
      .update(code)
      .where({ id: code.id })
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado' });
        throw err;
      });

    app.db('log_codes')
      .insert({
        code_id: code.id,
        action: 'activated',
        description: 'Ativação de código',
        created_by: 1,
      })
      .then()
      .catch((err) => {
        throw err;
      });

    return res.status(204).send();
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
            this.orWhere('c.batch_number', 'like', `%${search}%`);
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
    activeCode,
    deactiveCode,
    save,
    get,
    getById,
  };
};
