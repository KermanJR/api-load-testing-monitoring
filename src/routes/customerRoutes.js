const express = require('express');
const { register, login, updateProfile, deleteUser } = require('../controllers/customerController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: The customer was successfully registered
 *       500:
 *         description: Some server error
 */
router.post('/register', register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Some server error
 */
router.post('/login', login);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update customer profile
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: The customer was successfully updated
 *       404:
 *         description: The customer was not found
 *       500:
 *         description: Some server error
 */
router.put('/:id', authenticate, updateProfile);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       204:
 *         description: The customer was successfully deleted
 *       404:
 *         description: The customer was not found
 *       500:
 *         description: Some server error
 */
router.delete('/:id', authenticate, deleteUser);

module.exports = router;
