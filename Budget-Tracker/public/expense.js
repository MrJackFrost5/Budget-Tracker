// routes/expenses.js
const express = require('express');
const router = express.Router();
const expenseController = require('./ExpenseController');

// Middleware for authentication (if you have one)
// const { authenticateUser } = require('../middleware/auth.js');

router.post('/submit', /* authenticateUser, */ expenseController.handleExpenseSubmission);

module.exports = router;