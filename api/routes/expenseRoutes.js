const express = require('express')
const router = express.Router()
const { createExpense, getExpense, updateExpense, deleteExpense, getExpenses } = require('../controllers/expenseController')

// Route for create expense
router.post('/', createExpense)

// Route for fetching expense
router.get('/view/:id', getExpense)

// Route for edit expense
router.put('/:id', updateExpense)

// Route for delete expense
router.delete('/:id', deleteExpense)

// Get all expenses by user
router.get('/:id', getExpenses)

module.exports = router
