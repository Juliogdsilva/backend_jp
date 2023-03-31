/* eslint-disable no-unused-vars */
module.exports = (app) => {
  const {
    existsOrError,
    notExistsOrError,
  } = app.src.tools.validation;
  const { modelLogBatch } = app.src.models.log_batch;

  // const save = async (req, res) => {
  //   if (!req.originalUrl.startsWith('/log_codes'))
  // { return res.status(403).send({ msg: 'Solicitação invalida.' }); }

  //   const logBatch = await modelLogBatch(req.body);

  //   try {
  //     existsOrError(logBatch.batch_id, 'ID do lote não informado');
  //     const existsBatch = await app
  //       .db('batch')
  //       .select('limit', 'current_quantity')
  //       .where({ id: logBatch.batch_id, status: 'ative' })
  //       .first();
  //     existsOrError(existsBatch, 'Lote não existente ou inativo');
  //     existsOrError(logBatch.quantity, 'Quantidade de codigos não informado');
  //     if (existsBatch.limit)
  // eslint-disable-next-line max-len
  // notExistsOrError((logBatch.quantity + existsBatch.limit > existsBatch.limit), 'Quantidade de codigos maior que permitido');
  //     logBatch.start_number = existsBatch.current_quantity;
  //     logBatch.last_number = existsBatch.current_quantity + logBatch.quantity;
  //   } catch (msg) {
  //     return res.status(400).send({ msg });
  //   }

  //   logBatch.created_by = req.user.id;

  //   await app
  //     .db('log_batch')
  //     .insert(logBatch)
  //     .then()
  //     .catch((err) => {
  //       res.status(500).send({ msg: 'Erro inesperado' });
  //       throw err;
  //     });

  //   return res.status(204).send();
  // };

  const get = async (req, res) => {
    if (!req.originalUrl.startsWith('/log_codes')) return res.status(403).send({ msg: 'Solicitação invalida.' });

    const currentPage = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;
    const id = req.query.id || null;

    const logs = await app.db('log_codes as lc')
      .select('lc.*', 'c.batch_number', 'bt.name as batch_name')
      .leftJoin('codes as c', 'c.id', 'lc.code_id')
      .leftJoin('batch as bt', 'bt.id', 'c.batch_id')
      .modify((query) => {
        if (id) {
          query.where('code_id', id);
        }
      })
      .orderBy('created_at', 'desc')
      .paginate({ perPage, currentPage, isLengthAware: true })
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    return res.status(200).send({ ...logs });
  };

  return {
    // save,
    get,
  };
};
