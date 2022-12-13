module.exports = (app) => {
  const controllers = { ...app.src.controllers };

  // USERS
  app.route('/users')
    .post(controllers.users.saveUsers)
    .get(controllers.users.getAllUsers);

  app.route('/users/:id')
    .get(controllers.users.getUserById)
    .put(controllers.users.putUser)
    .delete(controllers.users.deleteUser);

  // PERMISSIONS
  app.route('/permissions')
    .post(controllers.permissions.savePermission)
    .get(controllers.permissions.getPermissions);

  app.route('/permissions/:id')
    .delete(controllers.permissions.deletePermission);

  // USER PERMISSIONS
  app.route('/user/permissions')
    .post(controllers.userPermissions.savePermission);

  app.route('/user/:id/permissions')
    .get(controllers.userPermissions.getPermission);

  app.route('/user/permissions/:id')
    .delete(controllers.userPermissions.deletePermission);

  // COMMON REQUESTS
  app.post('/version', (req, res) => res.status(200).send({ version: '2' }));
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
