const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');

const checkout = async (req, res) => {
  const customerId = req.customer.id;
  try {
    const cartItems = await Cart.findAll({ where: { customerId }, include: Product });
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    const orders = [];
    let totalAmount = 0;
    for (const item of cartItems) {
      const order = await Order.create({
        customerId,
        productId: item.productId,
        quantity: item.quantity,
        totalAmount: item.quantity * item.Product.price,
      });
      totalAmount += item.quantity * item.Product.price;
      orders.push(order);
    }

    await Cart.destroy({ where: { customerId } });

    res.status(201).json({ orders, totalAmount });
  } catch (error) {
    res.status(500).json({ error: 'Error processing checkout' });
  }
};

const processPayment = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    // Simulating payment process
    order.paid = true;
    await order.save();
    res.status(200).json({ message: 'Payment processed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error processing payment' });
  }
};

module.exports = {
  checkout,
  processPayment,
};
