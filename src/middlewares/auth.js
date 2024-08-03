const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const customer = await Customer.findByPk(decoded.userId);
    if (!customer) {
      throw new Error('Authentication failed');
    }
    req.customer = customer;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = {
  authenticate,
};
