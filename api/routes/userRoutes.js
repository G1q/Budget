const express = require('express')
const router = express.Router()
const { register, login, getProfile, editProfile, deleteAccount, updateSettings } = require('../controllers/userController')

// Route for user registration
router.post('/register', register)

// Route for user login
router.post('/login', login)

// Route for fetching user profile
router.get('/profile/:id', getProfile)

// Route for edit user profile
router.put('/edit/:id', editProfile)

// Route for edit user settings
router.put('/edit/settings/:id', updateSettings)

// Route for delete account
router.delete('/delete/:id', deleteAccount)

module.exports = router
