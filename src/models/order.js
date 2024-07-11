const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./customer');
const Product = require('./product');

const Order = sequelize.define('Order', {
  customerId: {
    type: DataTypes.INTEGER,
    references: {
      model: Customer,
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Order;
