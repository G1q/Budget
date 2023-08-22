const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const getUsers = async (req, res) => {
	try {
		const users = await User.find({}).select('-password')
		if (!users) {
			return res.status(404).json({ error: 'Users not found' })
		}

		res.status(200).json(users)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const deleteUser = async (req, res) => {
	try {
		const userId = req.params.id

		const deletedUser = await User.findByIdAndDelete(userId)
		res.status(200).json({ message: 'User deleted successfully!' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const createUser = async (req, res) => {
	try {
		const { username, email, password, role } = req.body

		// Check if the username and email are already taken
		const existingUsername = await User.findOne({ username })
		const existingEmail = await User.findOne({ email })

		if (existingUsername) {
			return res.status(400).json({ error: 'Username is already taken' })
		}

		if (existingEmail) {
			return res.status(400).json({ error: 'Email is already registered' })
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10)

		// Create a new user
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			role,
			active: true,
		})

		await newUser.save()

		res.status(201).json({ message: 'User registered successfully' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

module.exports = { getUsers, deleteUser, createUser }
