module.exports = (app) => {
  const haveRole = (role) => async (req, res, next) => {
    const userRole = req.user.role;
    if (!userRole) return res.status(404).send({ msg: 'Função não localizada.', status: true });

    if (userRole === role || role === 'all' || userRole === 'root') return next();
    return res.status(401).send({ msg: 'Nível de permissão negada!', status: true });
  };

  /*eslint-disable */
  const havePermission = (permission) => async (req, res, next) => {
    const { user } = req;
    const user_id = user.id;

    const userPermissions = await app.db('user_permissions')
      .where({ user_id })
      .join('permissions', 'user_permissions.permission_id', 'permissions.id')
      .select('permissions.name')
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    const userPermission = await userPermissions.find((p) => p.name === permission);
    if (userPermission) next();
    else res.status(401).send({ msg: 'Nível de permissão negada!', status: true });
  };

  return {
    haveRole,
    havePermission,
  };
};
