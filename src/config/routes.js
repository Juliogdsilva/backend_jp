const pjson = require('../../package.json');

module.exports = (app) => {
  const controllers = { ...app.src.controllers };

  // ------  AUTH REQUESTS ------
  app.post('/signin', controllers.auth.signin);
  app.post('/signup', controllers.participants.save);
  app.post('/validate_token', controllers.auth.validateToken);

  // ------  Participants ------
  app.route('/participants')
    .all(app.src.config.passport.authenticate())
    .post(controllers.participants.save)
    .get(controllers.participants.get);

  app.route('/participants/:id')
    .all(app.src.config.passport.authenticate())
    .get(controllers.participants.getById)
    .put(controllers.participants.save);
  //   .delete(controllers.participants.deleteparticipant);

  // ------  PERMISSIONS ------
  app.route('/permissions')
    .all(app.src.config.passport.authenticate())
    // .post(controllers.permissions.save)
    .get(controllers.permissions.get);

  // ------  CHATS ------
  // app.route('/chat')
  // .all(app.src.config.passport.authenticate())
  // .post(controllers.permissions.save)
  // .get(controllers.chat.connectChat);

  // ------  REPORTS ------
  app.route('/reports/9Osz93wjG')
    .get(controllers.reports.reports);

  // ------  REPORTS ------
  app.route('/payments/9Osz93wjG')
    .post(controllers.email.sendMailPayment);

  // ------  REPORTS ------
  app.route('/active/9Osz93wjG/:id')
    .post(controllers.participants.activeParticipants);

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
