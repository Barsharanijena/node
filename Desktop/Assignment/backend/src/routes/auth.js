const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Import the actual controller
const { register, login } = require('../controllers/authController');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

// Register route - NOW USING REAL CONTROLLER
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], register); // Use the actual controller

// Login route - NOW USING REAL CONTROLLER
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], login); // Use the actual controller

module.exports = router;