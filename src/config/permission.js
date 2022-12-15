module.exports = (app) => {
  const havePermission = (permission) => async (req, res, next) => {
    const { user } = req;

    const userPermissions = await app.db('user_permissions')
      .where({ id: user.id })
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
    havePermission,
  };
};
