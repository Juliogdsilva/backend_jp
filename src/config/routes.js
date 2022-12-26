const pjson = require('../../package.json');

module.exports = (app) => {
  const controllers = { ...app.src.controllers };

  // ------  AUTH REQUESTS ------
  app.post('/signin', controllers.auth.signin);
  app.post('/validate_token', controllers.auth.validateToken);

  // ------  USERS ------
  app.route('/users')
    .post(controllers.users.save)
    .get(controllers.users.get);

  app.route('/users/:id')
    //   .get(controllers.users.getUserById)
    .put(controllers.users.save);
  //   .delete(controllers.users.deleteUser);

  // ------  TRAININGS ------
  app.route('/trainings')
    .post(controllers.trainings.save)
    .get(controllers.trainings.get);

  app.route('/trainings/:id')
    .put(controllers.trainings.save);

  // ------  KITS ------
  app.route('/kits')
    .post(controllers.kits.save)
    .get(controllers.kits.get);

  app.route('/kits/:id')
    .put(controllers.kits.save);

  // ------  PRODUCTS ------
  app.route('/products')
    .post(controllers.products.save)
    .get(controllers.products.get);

  app.route('/products/:id')
    .put(controllers.products.save);

  // ------  SELLERS ------
  app.route('/sellers')
    .post(controllers.sellers.save)
    .get(controllers.sellers.get);

  app.route('/sellers/:id')
    .put(controllers.sellers.save);

  // ------  ACCREDITATION ------
  app.route('/block_seller/:id')
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
    // .post(controllers.permissions.save)
    .get(controllers.permissions.get);

  // ------  PERMISSIONS ------
  app.route('/counts')
    .get(controllers.counts.getCounts);

  // ------  REPORTS ------
  app.route('/reports')
    .get(controllers.reports.reports);

  app.route('/report_products')
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
