const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({ username, password: hashedPassword, email });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ userId: customer.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ error: 'User not found' });
    }
    customer.email = email;
    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ error: 'User not found' });
    }
    await customer.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};

module.exports = {
  register,
  login,
  updateProfile,
  deleteUser,
};
