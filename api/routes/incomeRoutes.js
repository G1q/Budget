const express = require('express')
const router = express.Router()
const { createIncome, deleteIncome, updateIncome, getIncome, getIncomes } = require('../controllers/incomeController')

router.post('/', createIncome)

router.delete('/:id', deleteIncome)

router.put('/:id', updateIncome)

router.get('/view/:id', getIncome)

router.get('/:id', getIncomes)

module.exports = router
