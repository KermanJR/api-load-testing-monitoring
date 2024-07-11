const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const customerRoutes = require('./routes/customerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const setupSwagger = require('./swagger');

const app = express();

app.use(bodyParser.json());
app.use('/api/customers', customerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', orderRoutes);

// Setup Swagger
setupSwagger(app);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

sequelize.sync().then(() => {
  console.log('Database connected');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = app;
