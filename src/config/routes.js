const pjson = require('../../package.json');

module.exports = (app) => {
  // const controllers = { ...app.src.controllers };

  // USERS
  // app.route('/users')
  //   .post(controllers.users.saveUsers)
  //   .get(controllers.users.getAllUsers);

  // app.route('/users/:id')
  //   .get(controllers.users.getUserById)
  //   .put(controllers.users.putUser)
  //   .delete(controllers.users.deleteUser);

  // COMMON REQUESTS
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
