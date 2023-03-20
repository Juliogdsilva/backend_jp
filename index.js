require('dotenv').config();
const app = require('express')();
const http = require('http').Server(app);
const consign = require('consign');
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['content-type'],
  },
});

const port = process.env.PORT || 4020;
const db = require('./src/config/db');

app.db = db;

consign()
  .then('./src/config/passport.js')
  .then('./src/config/socket.js')
  .then('./src/config/middlewares.js')
  .then('./src/config/permission.js')
  .then('./src/tools')
  .then('./src/models')
  .then('./src/controllers/email.js')
  .then('./src/controllers')
  .then('./src/config/routes.js')
  .into(app, io);

http.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});
