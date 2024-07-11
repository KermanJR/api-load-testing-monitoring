const Customer = require('./customer');
const Product = require('./product');
const Cart = require('./cart');
const Order = require('./order');

Customer.hasMany(Cart, { foreignKey: 'customerId' });
Customer.hasMany(Order, { foreignKey: 'customerId' });
Product.hasMany(Cart, { foreignKey: 'productId' });
Product.hasMany(Order, { foreignKey: 'productId' });

module.exports = {
  Customer,
  Product,
  Cart,
  Order,
};
