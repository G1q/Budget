const express = require('express')
const router = express.Router()
const { createTransfer, getTransfers, deleteTransfer, getTransfer, editTransfer } = require('../controllers/transferController')

// Create transfer
router.post('/', createTransfer)

// Route for fetching transfer
router.get('/view/:id', getTransfer)

// // Route for edit transfer
router.put('/:id', editTransfer)

// // Route for delete transfer
router.delete('/:id', deleteTransfer)

// Get all transfers per user
router.get('/:id', getTransfers)

module.exports = router
