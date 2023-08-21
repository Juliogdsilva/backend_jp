module.exports = (app) => {
  const {
    existsOrError,
    notExistsOrError,
  } = app.src.tools.validation;
  const { modelLogBatch } = app.src.models.log_batch;

  const save = async (req, res) => {
    if (!req.originalUrl.startsWith('/log_batch')) { return res.status(403).send({ msg: 'Solicitação invalida.' }); }

    const logBatch = await modelLogBatch(req.body);

    try {
      existsOrError(logBatch.batch_id, 'ID do lote não informado');
      const existsBatch = await app
        .db('batch')
        .select('limit', 'current_quantity')
        .where({ id: logBatch.batch_id, status: 'ative' })
        .first();
      existsOrError(existsBatch, 'Lote não existente ou inativo');
      existsOrError(logBatch.quantity, 'Quantidade de codigos não informado');
      if (existsBatch.limit) notExistsOrError((logBatch.quantity + existsBatch.limit > existsBatch.limit), 'Quantidade de codigos maior que permitido');
      logBatch.start_number = existsBatch.current_quantity;
      logBatch.last_number = (Number(existsBatch.current_quantity) + Number(logBatch.quantity));
    } catch (msg) {
      return res.status(400).send({ msg });
    }

    // logBatch.created_by = req.user.id;
    logBatch.created_by = 1;

    await app
      .db('log_batch')
      .insert(logBatch)
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado' });
        throw err;
      });

    return res.status(204).send();
  };

  const get = async (req, res) => {
    if (!req.originalUrl.startsWith('/log_batch')) return res.status(403).send({ msg: 'Solicitação invalida.' });

    const currentPage = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;

    const logs = await app.db('log_batch as lb')
      .select('lb.*', 'bt.name as batch_name', 'bt.limit as batch_limit', 'u.name as user_name')
      .leftJoin('batch as bt', 'bt.id', 'lb.batch_id')
      .leftJoin('users as u', 'u.id', 'lb.created_by')
      .orderBy('id', 'desc')
      .paginate({ perPage, currentPage, isLengthAware: true })
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    return res.status(200).send({ ...logs });
  };

  return {
    save,
    get,
  };
};
