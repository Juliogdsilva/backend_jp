const cron = require('node-cron');
// const { queueQrCode } = require('./queue');

module.exports = (app) => {
  const { queueQrCode } = app.src.jobs.queue;
  cron.schedule('* * * * *', async () => {
    // BUSCA DE PEDIDOS
    const log = await app.db('log_batch as lb')
      .select('lb.*', 'bt.name as batch')
      .leftJoin('batch as bt', 'bt.id', 'lb.batch_id')
      .where('lb.status', 'waiting')
      .first()
      .catch((err) => {
        throw err;
      });

    if (!log) return;

    // ATUALIZA STATUS DA ORDER
    await app
      .db('log_batch')
      .update({ status: 'processing' })
      .where({ id: log.id })
      .then()
      .catch((err) => {
        throw err;
      });

    for (let i = log.start_number + 1; i <= log.last_number; i++) {
      const number = i;

      queueQrCode.push({ batchId: log.batch_id, number }, (error) => {
        if (error) {
          console.log(error);
        }
      });
    }
  });

  // app
  //       .db('log_batch')
  //       .update({ status: 'finished' })
  //       .where({ id: log.id })
  //       .then()
  //       .catch((err) => {
  //         throw err;
  //       });
};
