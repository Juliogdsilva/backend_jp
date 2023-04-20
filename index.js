require('dotenv').config();
const app = require('express')();
const consign = require('consign');
const Sentry = require('@sentry/node');

const port = process.env.PORT || 4015;
const db = require('./src/config/db');

Sentry.init({
  dsn: 'https://f8605f00aeab4701b4e28089053641b0@o4505046707863552.ingest.sentry.io/4505046813835264',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],

  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

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

app.use(Sentry.Handlers.errorHandler());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.end(`${res.sentry}\n`);
});

app.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});
