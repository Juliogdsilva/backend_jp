const async = require('async');

module.exports = (app) => {
  const { generatorCode } = app.src.controllers.codes;

  const queueQrCode = async.queue(async (task) => {
    const { id, batchId, number } = task;

    // GERA O CODIGO
    await generatorCode(batchId, number);

    // ATUALIZA QTD NO PEDIDO
    app
      .db('batch')
      .update({ current_quantity: number })
      .where({ id: batchId })
      .then()
      .catch((err) => {
        throw err;
      });

    //  ATUALIZA O CURRENT NO LOG_BAT
    app
      .db('log_batch')
      .update({ current_number: number })
      .where({ id })
      .then()
      .catch((err) => {
        throw err;
      });
  }, process.env.QTD_MAKE_QRCODE);

  queueQrCode.drain(() => {
    console.log('Todas as tarefas foram concluídas');
  });

  return {
    queueQrCode,
  };
};
