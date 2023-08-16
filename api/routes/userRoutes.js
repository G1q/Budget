const express = require('express')
const router = express.Router()
const { register, login, getProfile } = require('../controllers/userController')

// Route for user registration
router.post('/register', register)

// Route for user login
router.post('/login', login)

// Route for fetching user profile
router.get('/profile', getProfile)

// Add more routes as needed (e.g., updating profile, changing password)

module.exports = router
