const pjson = require('../../package.json');

module.exports = (app) => {
  const controllers = { ...app.src.controllers };

  // ------  AUTH REQUESTS ------
  app.post('/signin', controllers.auth.signin);
  app.post('/validate_token', controllers.auth.validateToken);

  // ------  PERMISSIONS ------
  app
    .route('/permissions')
    .all(app.src.config.passport.authenticate())
    .post(controllers.permissions.save)
    .get(controllers.permissions.get);

  // ------  USERS ------
  app
    .route('/users')
    .all(app.src.config.passport.authenticate())
    .post(controllers.users.save)
    .get(controllers.users.get);

  app
    .route('/users/:id')
    .all(app.src.config.passport.authenticate())
    .put(controllers.users.save)
    .get(controllers.users.getById)
    .delete(controllers.users.del);

  // ------  BATCH ------
  app
    .route('/batch')
    .all(app.src.config.passport.authenticate())
    .post(controllers.batch.save)
    .get(controllers.batch.get);

  // ------  LOG BATCH ------
  app
    .route('/log_batch')
    .all(app.src.config.passport.authenticate())
    .post(controllers.logBatch.save)
    .get(controllers.logBatch.get);

  // ------  LOG CODES ------
  app
    .route('/log_codes')
    .all(app.src.config.passport.authenticate())
    // .post(controllers.logBatch.save)
    .get(controllers.logCodes.get);

  // ------  CODES ------
  app
    .route('/codes')
    .all(app.src.config.passport.authenticate())
    .put(controllers.codes.save)
    .get(controllers.codes.get);

  app
    .route('/codes/:id')
    .all(app.src.config.passport.authenticate())
    .get(controllers.codes.getById);

  app
    .route('/check_code')
    .all(app.src.config.passport.authenticate())
    .post(controllers.access.checkQrcode);

  // ------  COMMON REQUESTS ------
  app.get('/version', (req, res) => res.status(200).send({ version: pjson.version }));
  app.use('*', (req, res) => res.status(404).send({ msg: 'requested endpoint not found' }));
};
