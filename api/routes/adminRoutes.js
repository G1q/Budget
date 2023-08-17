const express = require('express')
const router = express.Router()
const { getUsers } = require('../controllers/adminController')

// Route for user registration
router.get('/users', getUsers)

module.exports = router
