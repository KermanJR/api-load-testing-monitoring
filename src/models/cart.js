const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./customer');
const Product = require('./product');

const Cart = sequelize.define('Cart', {
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
});

module.exports = Cart;
