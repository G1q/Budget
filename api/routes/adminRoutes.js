const express = require('express')
const router = express.Router()
const { getUsers, deleteUser, createUser, getUser, updateUser } = require('../controllers/adminController')

// Route for all users
router.get('/users', getUsers)

// Delete user
router.delete('/users/:id', deleteUser)

// Register new user
router.post('/users/register', createUser)

// Get user profile
router.get('/users/:id', getUser)

// Edit user
router.put('/users/edit/:id', updateUser)

module.exports = router
