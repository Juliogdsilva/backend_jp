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
  .then('./src/tools/encrypt.js')
  .then('./src/tools/generator.js')
  .then('./src/tools/validation.js')
  .then('./src/models')
  .then('./src/controllers')
  .then('./src/tools/jobs.js')
  .then('./src/config/routes.js')
  .into(app);

app.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});
