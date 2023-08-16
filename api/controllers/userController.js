const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const register = async (req, res) => {
	try {
		const { username, email, password } = req.body

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
		})

		await newUser.save()

		res.status(201).json({ message: 'User registered successfully' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const login = async (req, res) => {
	try {
		const { email, password } = req.body

		// Check if the user exists
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		// Compare passwords
		const passwordMatch = await bcrypt.compare(password, user.password)
		if (!passwordMatch) {
			return res.status(401).json({ error: 'Invalid credentials' })
		}

		// Generate a JWT token
		const token = jwt.sign({ userId: user._id, userRole: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })

		res.status(200).json({ token })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const getProfile = async (req, res) => {
	try {
		// Fetch user data from authentication middleware
		const userId = req.user.userId

		// Fetch user profile
		const user = await User.findById(userId).select('-password')
		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		res.status(200).json(user)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

module.exports = { register, login, getProfile }
