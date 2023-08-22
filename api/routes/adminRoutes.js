const express = require('express')
const router = express.Router()
const { getUsers, deleteUser, createUser } = require('../controllers/adminController')

// Route for all users
router.get('/users', getUsers)

// Delete user
router.delete('/users/:id', deleteUser)

// Register new user
router.post('/users/register', createUser)

module.exports = router
