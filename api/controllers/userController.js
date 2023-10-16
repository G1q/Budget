const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { ERROR_MESSAGES } = require('../messages/errors.js')
const { SUCCESS_MESSAGES } = require('../messages/success.js')

const register = async (req, res) => {
	try {
		const { username, email, password } = req.body

		// Check if the username and email are already taken
		const existingUsername = await User.findOne({ username })
		const existingEmail = await User.findOne({ email })

		if (existingUsername) return res.status(400).json({ message: ERROR_MESSAGES.EXISTING_USERNAME.message })

		if (existingEmail) return res.status(400).json({ message: ERROR_MESSAGES.EXISTING_EMAIL.message })

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10)

		// Create a new user
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
		})

		await newUser.save()

		res.status(201).json({ message: SUCCESS_MESSAGES.USER.REGISTERED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const login = async (req, res) => {
	try {
		const { email, password } = req.body

		// Check if the user exists
		const user = await User.findOne({ email })
		if (!user) return res.status(404).json({ message: ERROR_MESSAGES.NO_EMAIL_USER.message })

		// Check if user is active
		if (!user.active) return res.status(403).json({ message: ERROR_MESSAGES.NO_ACTIVE_USER.message })

		// Compare passwords
		const passwordMatch = await bcrypt.compare(password, user.password)
		if (!passwordMatch) return res.status(401).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS.message })

		// Generate a JWT token
		const token = jwt.sign({ userId: user._id, userRole: user.role, username: user.username, settings: user.settings }, process.env.JWT_SECRET, {
			expiresIn: '4h',
		})

		res.status(200).json({ token })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getProfile = async (req, res) => {
	try {
		const userId = req.params.id

		// Fetch user profile
		const user = await User.findById(userId).select('-password')
		if (!user) return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })

		res.status(200).json(user)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
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
		if (existingEmail && user.email !== email) return res.status(400).json({ message: ERROR_MESSAGES.EXISTING_EMAIL.message })

		// Check if it's another user with the same username, but continue if the new username is same with user username
		const existingUsername = await User.findOne({ username })
		if (existingUsername && user.username !== username) return res.status(400).json({ message: ERROR_MESSAGES.EXISTING_USERNAME.message })

		// Check if password is changed in FE form
		if (password) hashedPassword = await bcrypt.hash(password, 10)

		const updatedUser = await User.findByIdAndUpdate(userId, { username, email, password: hashedPassword }, { new: true })

		if (!updatedUser) return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })

		res.status(200).json(updatedUser)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const updateSettings = async (req, res) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(req.params.id, { settings: req.body }, { new: true })

		if (!updatedUser) return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })

		// Generate a JWT token
		const token = jwt.sign(
			{ userId: updatedUser._id, userRole: updatedUser.role, username: updatedUser.username, settings: updatedUser.settings },
			process.env.JWT_SECRET,
			{
				expiresIn: '4h',
			}
		)

		res.status(200).json({ message: SUCCESS_MESSAGES.USER.UPDATED.message, token })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const deleteAccount = async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: SUCCESS_MESSAGES.USER.DELETED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

module.exports = { register, login, getProfile, editProfile, deleteAccount, updateSettings }
