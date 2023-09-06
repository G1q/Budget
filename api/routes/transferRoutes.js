const express = require('express')
const router = express.Router()
const { createTransfer, getTransfers, deleteTransfer, getTransfer } = require('../controllers/transferController')

// Create transfer
router.post('/', createTransfer)

// Route for fetching expense
router.get('/view/:id', getTransfer)

// // Route for edit expense
// router.put('/:id', editExpense)

// // Route for delete expense
router.delete('/:id', deleteTransfer)

// Get all transfers per user
router.get('/:id', getTransfers)

module.exports = router
