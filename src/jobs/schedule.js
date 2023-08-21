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

    for (let i = log.start_number + 1; i <= log.last_number; i += 1) {
      const number = i;

      queueQrCode.push({ id: log.id, batchId: log.batch_id, number }, (error) => {
        if (error) {
          console.log(error);
        }
      });
    }
  });
  cron.schedule('* * * * *', async () => {
    // BUSCA DE PEDIDOS
    const logs = await app.db('log_batch')
      .select('id', 'last_number', 'current_number')
      .where('status', 'processing')
      .catch((err) => {
        throw err;
      });

    logs.forEach((log) => {
      if (log.last_number === log.current_number) {
        app
          .db('log_batch')
          .update({ status: 'finished' })
          .where({ id: log.id })
          .then()
          .catch((err) => {
            throw err;
          });
      }
    });
  });
};
