const express = require('express')
const router = express.Router()
const { createSource, deleteSource, getSources, getSource } = require('../controllers/incomeSourceController')

router.post('/', createSource)

router.get('/:id', getSources)

router.delete('/:id', deleteSource)

router.get('/view/:id', getSource)

module.exports = router
