const express = require('express')
const router = express.Router()
const { createBudget, getBudget, updateBudget, deleteBudget, getBudgets } = require('../controllers/budgetController')

// Route for create budget
router.post('/', createBudget)

// Route for fetching budget
router.get('/view/:id', getBudget)

// Route for edit budget
router.put('/:id', updateBudget)

// Route for delete budget
router.delete('/:id', deleteBudget)

// Get all budgets by user
router.get('/:id', getBudgets)

module.exports = router
