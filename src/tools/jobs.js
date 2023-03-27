const cron = require('node-cron');

module.exports = (app) => {
  cron.schedule('* * * * *', async () => {
    console.log('passando');
    const logs = await app.db('log_batch as lb')
      .select('lb.*', 'bt.name as batch')
      .leftJoin('batch as bt', 'bt.id', 'lb.batch_id')
      .where('lb.status', 'waiting')
      .limit(2)
      .catch((err) => {
        throw err;
      });
    console.log(logs);
    // eslint-disable-next-line no-plusplus
    for (let l = 0; l < logs.length; l++) {
      const log = logs[l];
      console.log(log);
      app
        .db('log_batch')
        .update({ status: 'processing' })
        .where({ id: log.id })
        .then()
        .catch((err) => {
          throw err;
        });

      for (let i = 0; i < log.last_number; i++) {
        const number = i;
        console.log(number);
        app.src.controllers.codes.generatorCode(log.batch, number);
      }
    }
  });
};
