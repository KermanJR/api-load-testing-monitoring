const express = require('express');
const { checkout, processPayment } = require('../controllers/orderController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Checkout the cart
 *     tags: [Orders]
 *     responses:
 *       201:
 *         description: Checkout completed successfully
 *       400:
 *         description: No items in cart
 *       500:
 *         description: Some server error
 */
router.post('/checkout', authenticate, checkout);

/**
 * @swagger
 * /payment:
 *   post:
 *     summary: Process the payment for an order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Some server error
 */
router.post('/payment', authenticate, processPayment);

module.exports = router;
