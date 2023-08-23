const express = require('express')
const router = express.Router()
const { createCategory, getCategories, getCategory, deleteCategory } = require('../controllers/categoryController')

router.post('/', createCategory)

router.get('/:id', getCategories)

router.delete('/:id', deleteCategory)

router.get('/view/:id', getCategory)

module.exports = router
