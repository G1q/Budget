const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const register = async (req, res) => {
	try {
		const { username, email, password } = req.body

		// Check if the username and email are already taken
		const existingUsername = await User.findOne({ username })
		const existingEmail = await User.findOne({ email })

		if (existingUsername) return res.status(400).json({ error: 'Username is already taken' })

		if (existingEmail) return res.status(400).json({ error: 'Email is already registered' })

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
		if (!user) return res.status(404).json({ error: 'User not found' })

		// Check if user is active
		if (!user.active) return res.status(403).json({ error: 'User is not active!' })

		// Compare passwords
		const passwordMatch = await bcrypt.compare(password, user.password)
		if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' })

		// Generate a JWT token
		const token = jwt.sign({ userId: user._id, userRole: user.role, username: user.username, settings: user.settings }, process.env.JWT_SECRET, {
			expiresIn: '4h',
		})

		res.status(200).json({ token })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const getProfile = async (req, res) => {
	try {
		const userId = req.params.id

		// Fetch user profile
		const user = await User.findById(userId).select('-password')
		if (!user) return res.status(404).json({ error: 'User not found' })

		res.status(200).json(user)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const editProfile = async (req, res) => {
	try {
		const userId = req.params.id
		const { username, email, password } = req.body
		let hashedPassword = password

		// Check if it's another user with the same email, but continue if the new email is same with user email
		const existingEmail = await User.findOne({ email: email })
		const user = await User.findById(userId)
		if (existingEmail && user.email !== email) return res.status(400).json({ error: 'Email is already used by another user!' })

		// Check if it's another user with the same username, but continue if the new username is same with user username
		const existingUsername = await User.findOne({ username })
		if (existingUsername && user.username !== username) return res.status(400).json({ error: 'Username is already used!' })

		// Check if password is changed in FE form
		if (password) hashedPassword = await bcrypt.hash(password, 10)

		const updatedUser = await User.findByIdAndUpdate(userId, { username, email, password: hashedPassword }, { new: true })

		if (!updatedUser) return res.status(404).json({ error: 'User not found' })

		res.status(200).json(updatedUser)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const deleteAccount = async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: 'User deleted successfully!' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

module.exports = { register, login, getProfile, editProfile, deleteAccount }
