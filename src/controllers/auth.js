const authSecret = process.env.AUTH_SECRET;
const jwt = require('jwt-simple');

module.exports = (app) => {
  // const { justNumbers } = app.src.tools.validation;
  // eslint-disable-next-line no-unused-vars
  const { encryptPassword, comparePassword } = app.src.tools.encrypt;

  const signin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ msg: 'Informe usuário e senha!', status: true });
    }
    // req.body.cpf = await justNumbers(req.body.cpf);

    const user = await app.db('users')
      .where({ email: req.body.email })
      .first()
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    if (!user) return res.status(400).send({ msg: 'Usuário ou Senha Inválidos', status: true });
    if (user.deleted_at) return res.status(401).send({ msg: 'Usuário desativado! Entre em contato com o administrador', status: true });
    // eslint-disable-next-line eqeqeq
    if (user.status == 'blocked') return res.status(401).send({ msg: 'Usuário bloqueado! Entre em contato com o administrador', status: true });

    const isMatch = await comparePassword(req.body.password, user.password);
    if (!isMatch) return res.status(401).send({ msg: 'Usuário ou Senha Inválidos', status: true });

    const permissions = await app.db('user_permissions')
      .where({ user_id: user.id })
      .leftJoin('permissions', 'user_permissions.permission_id', 'permissions.id')
      .select('permissions.name as permission', 'permissions.alias')
      .catch((err) => {
        res.status(500).send({ msg: 'Erro inesperado', status: true });
        throw err;
      });

    const now = Math.floor(Date.now() / 1000);
    const days = Number(process.env.DAYS_TOKEN) || 3;

    const payload = {
      id: user.id,
      name: user.name,
      permissions,
      iat: now,
      exp: now + (60 * 60 * 24 * days),
    };

    return res.status(200).send({
      ...payload,
      token: jwt.encode(payload, authSecret),
    });
  };

  const validateToken = async (req, res) => {
    const userToken = req.body.token;
    if (!userToken) return res.status(400).send({ msg: 'Token não informado', status: true });

    try {
      const token = await jwt.decode(userToken, authSecret);
      if (new Date(token.exp * 1000) > new Date()) {
        return res.send(true);
      }
    } catch (e) {
      // problema com o token
      return res.status(500).send({ msg: 'Porfavor faça o login novamente.', status: true });
    }

    return res.status(500).send({ msg: 'Porfavor faça o login novamente.', status: true });
  };

  return { signin, validateToken };
};
