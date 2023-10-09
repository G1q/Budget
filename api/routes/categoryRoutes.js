const express = require('express')
const router = express.Router()
const { createCategory, getCategories, getCategory, deleteCategory, updateCategory } = require('../controllers/categoryController')

router.post('/', createCategory)

router.get('/:id', getCategories)

router.delete('/:id', deleteCategory)

router.get('/view/:id', getCategory)

router.put('/edit/:id', updateCategory)

module.exports = router
