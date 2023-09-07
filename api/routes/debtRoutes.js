const express = require('express')
const router = express.Router()
const { createDebt, editDebt, getDebt, getDebts, deleteDebt } = require('../controllers/debtController')

// Route for create debt
router.post('/', createDebt)

// Route for fetching debt
router.get('/view/:id', getDebt)

// Route for edit debt
router.put('/:id', editDebt)

// Route for delete debt
router.delete('/:id', deleteDebt)

// Get all debts by user
router.get('/:id', getDebts)

module.exports = router
