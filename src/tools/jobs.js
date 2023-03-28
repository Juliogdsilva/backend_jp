const cron = require('node-cron');

module.exports = (app) => {
  cron.schedule('* * * * *', async () => {
    const logs = await app.db('log_batch as lb')
      .select('lb.*', 'bt.name as batch')
      .leftJoin('batch as bt', 'bt.id', 'lb.batch_id')
      .where('lb.status', 'waiting')
      .limit(2)
      .catch((err) => {
        throw err;
      });
    // eslint-disable-next-line no-plusplus
    for (let l = 0; l < logs.length; l++) {
      const log = logs[l];
      app
        .db('log_batch')
        .update({ status: 'processing' })
        .where({ id: log.id })
        .then()
        .catch((err) => {
          throw err;
        });

      // eslint-disable-next-line no-plusplus
      for (let i = log.start_number + 1; i <= log.last_number; i++) {
        const number = i;
        app.src.controllers.codes.generatorCode(log.batch_id, log.batch, number);

        app
          .db('batch')
          .update({ current_quantity: number })
          .where({ id: log.batch_id })
          .then()
          .catch((err) => {
            throw err;
          });
      }

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
};
