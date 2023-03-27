require('dotenv').config();
const app = require('express')();
const consign = require('consign');

const port = process.env.PORT || 4020;
const db = require('./src/config/db');

app.db = db;

consign()
  .then('./src/config/passport.js')
  .then('./src/config/middlewares.js')
  .then('./src/config/permission.js')
  .then('./src/tools')
  .then('./src/models')
  .then('./src/controllers/email.js')
  .then('./src/controllers')
  .then('./src/config/routes.js')
  .into(app);

http.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});
