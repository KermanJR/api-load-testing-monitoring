const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const customerRoutes = require('./routes/customerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const prometheus = require('prom-client')
const setupSwagger = require('./swagger');

const collectDefaultMetrics = prometheus.collectDefaultMetrics;
const register = prometheus.register;
collectDefaultMetrics({ register });


const app = express();

const request_total_counter = new prometheus.Counter({
  name: 'request_total',
  help: 'Contador de Requisições',
  labelNames: ['method', 'statusCode'],
});

const request_time_histogram = new prometheus.Histogram({
  name: 'aula_request_time_seconds',
  help: 'Tempo de Resposta das Requisições',
  buckets: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
});

const request_time_summary = new prometheus.Summary({
  name: 'aula_summary_request_time_seconds',
  help: 'Tempo de Resposta das Requisições',
  percentiles: [0.01, 0.05, 0.5, 0.9, 0.95, 0.99, 0.999],
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get('/', async function (req, res) {
  const success = req.query.success == null || req.query.success === 'true';
  const statusCode = success ? 200 : 500;
  request_total_counter.labels({ method: 'GET', statusCode: statusCode }).inc(); // Incrementando em 1 um contador da quantidade de requisições desta rota na aplicação

  const initialTime = Date.now();
  await sleep(100 * Math.random());
  const durationTime = Date.now() - initialTime;
  request_time_histogram.observe(durationTime); // Adicionando o tempo de resposta da requisição para visualização do histograma
  request_time_summary.observe(durationTime); // Adicionando o tempo de resposta da requisição para visualização dos percentis

  res.status(statusCode).json({ success: success, data: { message: `Requisição realizada em ${durationTime} ms.` } });
});

app.get('/metrics', async function (req, res) {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});


app.use(bodyParser.json());
app.use('/api/customers', customerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', orderRoutes);

// Configurar Swagger
setupSwagger(app);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

sequelize.authenticate();
// Sincronizar o banco de dados
sequelize.sync({ force: true }).then(() => {
  console.log('Database connected and synchronized');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = app;
