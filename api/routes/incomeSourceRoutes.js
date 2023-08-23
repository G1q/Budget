const express = require('express')
const router = express.Router()
const { createSource, deleteSource, getSources } = require('../controllers/incomeSourceController')

// Route for create source
router.post('/', createSource)

// Route for fetching user profile
router.get('/:id', getSources)

// Route for delete a source
router.delete('/:id', deleteSource)

module.exports = router
