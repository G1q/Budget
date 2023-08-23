const express = require('express')
const router = express.Router()
const { createSource, deleteSource, getSources } = require('../controllers/incomeSourceController')

router.post('/', createSource)

router.get('/:id', getSources)

router.delete('/:id', deleteSource)

module.exports = router
