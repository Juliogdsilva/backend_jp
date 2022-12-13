const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors({ exposedHeaders: ['Content-Disposition'] }));

  app.use((req, res, next) => {
    const oldSend = res.send;
    res.send = function (data) {
      const newData = {
        ...data,
        status: true,
        timestamp: new Date().getTime(),
      };
      res.send = oldSend;
      return res.send(newData);
    };
    next();
  });
};
