const pjson = require('../../package.json');

module.exports = (app) => {
  const controllers = { ...app.src.controllers };

  // ------  AUTH REQUESTS ------
  app.post('/signin', controllers.auth.signin);
  app.post('/validate_token', controllers.auth.validateToken);

  // ------  USERS ------
  app.route('/users')
    .all(app.src.config.passport.authenticate())
    .post(controllers.users.save)
    .get(controllers.users.get);

  app.route('/users/:id')
    .all(app.src.config.passport.authenticate())
    //   .get(controllers.users.getUserById)
    .put(controllers.users.save);
  //   .delete(controllers.users.deleteUser);

  // ------  TRAININGS ------
  app.route('/trainings')
    .all(app.src.config.passport.authenticate())
    .post(controllers.trainings.save)
    .get(controllers.trainings.get);

  app.route('/trainings/:id')
    .all(app.src.config.passport.authenticate())
    .put(controllers.trainings.save);

  // ------  KITS ------
  app.route('/kits')
    .all(app.src.config.passport.authenticate())
    .post(controllers.kits.save)
    .get(controllers.kits.get);

  app.route('/kits/:id')
    .all(app.src.config.passport.authenticate())
    .put(controllers.kits.save);

  // ------  PRODUCTS ------
  app.route('/products')
    .all(app.src.config.passport.authenticate())
    .post(controllers.products.save)
    .get(controllers.products.get);

  app.route('/products/:id')
    .all(app.src.config.passport.authenticate())
    .put(controllers.products.save);

  // ------  SELLERS ------
  app.route('/sellers')
    .all(app.src.config.passport.authenticate())
    .post(controllers.sellers.save)
    .get(controllers.sellers.get);

  app.route('/sellers/:id')
    .all(app.src.config.passport.authenticate())
    .put(controllers.sellers.save);

  // ------  ACCREDITATION ------
  app.route('/block_seller/:id')
    .all(app.src.config.passport.authenticate())
    .post(controllers.accreditation.blockSeller);

  app.route('/accreditation')
    .all(app.src.config.passport.authenticate())
    .post(controllers.accreditation.accreditation);

  app.route('/seller_training')
    .all(app.src.config.passport.authenticate())
    .post(controllers.accreditation.saveTraining);

  app.route('/seller_kit')
    .all(app.src.config.passport.authenticate())
    .post(controllers.accreditation.saveKit);

  // ------  PERMISSIONS ------
  app.route('/permissions')
    .all(app.src.config.passport.authenticate())
    // .post(controllers.permissions.save)
    .get(controllers.permissions.get);

  // ------  PERMISSIONS ------
  app.route('/counts')
    .all(app.src.config.passport.authenticate())
    .get(controllers.counts.getCounts);

  // ------  REPORTS ------
  app.route('/reports')
    .all(app.src.config.passport.authenticate())
    .get(controllers.reports.reports);

  app.route('/report_products')
    .all(app.src.config.passport.authenticate())
    .get(controllers.products.report);

  // ------  COMMON REQUESTS ------
  app.get('/version', (req, res) => res.status(200).send({ version: pjson.version }));
  app.use('*', (req, res) => res.status(404).send({ msg: 'requested endpoint not found' }));
};

// IMGAES - UPLOADS
// app.route('/uploads')
//   .post(app.multer.single('image'), async (req, res) => {
//     if (req.file) {
//       await app.sharp(req.file, 250)
//         .then(() => res.status(200).send({ msg: 'ok' }))
//         .catch(() => res.status(200).send({ msg: 'ruimmm1' }))
//     }

//     else res.status(200).send({ msg: 'sem pic' })
//   });
