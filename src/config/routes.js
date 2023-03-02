const pjson = require('../../package.json');

module.exports = (app) => {
  const controllers = { ...app.src.controllers };

  // ------  AUTH REQUESTS ------
  app.post('/signin', controllers.auth.signin);
  app.post('/validate_token', controllers.auth.validateToken);

  // ------  USERS ------
  app.route('/participants')
    .all(app.src.config.passport.authenticate())
    .post(controllers.participants.save)
    .get(controllers.participants.get);

  app.route('/participants/:id')
    .all(app.src.config.passport.authenticate())
    //   .get(controllers.participants.getparticipantById)
    .put(controllers.participants.save);
  //   .delete(controllers.participants.deleteparticipant);

  // ------  PERMISSIONS ------
  app.route('/permissions')
    .all(app.src.config.passport.authenticate())
    // .post(controllers.permissions.save)
    .get(controllers.permissions.get);

  // ------  REPORTS ------
  app.route('/reports')
    .all(app.src.config.passport.authenticate())
    .get(controllers.reports.reports);

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
