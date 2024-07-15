const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const customerRoutes = require('./routes/customerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const setupSwagger = require('./swagger');
const client = require('prom-client');
const Customer = require('./models/customer'); // Importa o modelo Customer

const app = express();

// Configuração de métricas Prometheus
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Métricas customizadas
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5] // Durations in seconds
});

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP recebidas',
  labelNames: ['method', 'route', 'status_code']
});

const httpErrorCounter = new client.Counter({
  name: 'http_errors_total',
  help: 'Total de erros HTTP',
  labelNames: ['method', 'route', 'status_code']
});

app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    const route = req.route && req.route.path ? req.route.path : 'unknown';
    const labels = { method: req.method, route: route, status_code: res.statusCode };
    end(labels);
    httpRequestCounter.inc(labels);
    if (res.statusCode >= 400) {
      httpErrorCounter.inc(labels);
    }
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
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

// Sincronizar o banco de dados
sequelize.sync({ force: true }).then(() => {
  console.log('Database connected and synchronized');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = app;
