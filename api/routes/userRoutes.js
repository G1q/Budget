const express = require('express')
const router = express.Router()
const { register, login, getProfile, editProfile } = require('../controllers/userController')

// Route for user registration
router.post('/register', register)

// Route for user login
router.post('/login', login)

// Route for fetching user profile
router.get('/profile/:id', getProfile)

// Route for edit user profile
router.put('/edit/:id', editProfile)

module.exports = router
