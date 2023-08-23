const express = require('express')
const router = express.Router()
const { createIncome, deleteIncome, editIncome, getIncome, getIncomes } = require('../controllers/incomeController')

router.post('/', createIncome)

router.delete('/:id', deleteIncome)

router.put('/:id', editIncome)

router.get('/view/:id', getIncome)

router.get('/:id', getIncomes)

module.exports = router
