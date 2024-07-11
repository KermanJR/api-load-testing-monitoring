const Cart = require('../models/cart');
const Product = require('../models/product');

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const customerId = req.customer.id;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const cartItem = await Cart.create({ customerId, productId, quantity });
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Error adding product to cart' });
  }
};

module.exports = {
  addToCart,
};
