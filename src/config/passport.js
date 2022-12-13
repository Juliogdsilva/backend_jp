const authSecret = process.env.AUTH_SECRET;
const passport = require('passport');
const passportJwt = require('passport-jwt');

const { Strategy, ExtractJwt } = passportJwt;

module.exports = (app) => {
  const params = {
    secretOrKey: authSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(params, async (payload, done) => {
    // let company_id = await getUserCompany(payload.id)
    // let places = await getUserPlaces(payload.id, payload.role, company_id)
    app.db('users')
      .where({ id: payload.id })
      .first()
      .then((user) => done(null, user ? { ...payload } : false))
      .catch((err) => done(err, false));
  });

  passport.use(strategy);

  // const getUserCompany = async (id) => {
  //   const company = await app.db('user_company')
  //     .select('company_id')
  //     .where('user_id', id)
  //     .first();
  //   return company ? company.company_id : null;
  // };

  // const getUserPlaces = async (id, role, company) => {
  //   let places;
  //   if (role == 'owner') {
  //     places = await app.db('places')
  //       .select('id')
  //       .where({ company_id: company });
  //     places = places.map((p) => p.id);
  //   } else {
  //     places = await app.db('user_places')
  //       .select('place_id')
  //       .where({ user_id: id });
  //     places = places.map((p) => p.place_id);
  //   }
  //   return places;
  // };

  return {
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
};
