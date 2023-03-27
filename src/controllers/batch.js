module.exports = (app) => {
  const {
    existsOrError,
    notExistsOrError,
  } = app.src.tools.validation;
  const { modelBatch } = app.src.models.batch;

  const save = async (req, res) => {
    if (!req.originalUrl.startsWith('/batch')) { return res.status(403).send({ msg: 'Solicitação invalida.' }); }

    const batch = await modelBatch(req.body);

    try {
      existsOrError(batch.name, 'Nome não informado');
      notExistsOrError(batch.name.length > 3, 'Número de Caracteres maior que o permitido');
      batch.name = batch.name.toUpperCase();
      existsOrError(batch.date_limit || batch.time_limit || batch.usage_limit, 'Nenhum modo de utilização informado');
    } catch (msg) {
      return res.status(400).send({ msg });
    }

    await app
      .db('batch')
      .insert(batch)
      .then()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado' });
        throw err;
      });

    return res.status(204).send();
  };

  const get = async (req, res) => {
    if (!req.originalUrl.startsWith('/batch')) return res.status(403).send({ msg: 'Solicitação invalida.' });

    const currentPage = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;

    const permissions = await app.db('batch')
      .select()
      .paginate({ perPage, currentPage, isLengthAware: true })
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    return res.status(200).send({ ...permissions });
  };

  return {
    save,
    get,
  };
};
