const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { ERROR_MESSAGES } = require('../messages/errors.js')
const { SUCCESS_MESSAGES } = require('../messages/success.js')

const createUser = async (req, res) => {
	try {
		const { username, email, password, role } = req.body

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
			role,
			active: true,
		})

		await newUser.save()

		res.status(201).json({ message: SUCCESS_MESSAGES.USER.REGISTERED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getUsers = async (req, res) => {
	try {
		const users = await User.find({}).select('-password')
		if (!users) return res.status(404).json({ message: ERROR_MESSAGES.NO_USERS_FOUND.message })

		res.status(200).json(users)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select('-password')
		if (!user) return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })

		res.status(200).json(user)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const updateUser = async (req, res) => {
	try {
		const userId = req.params.id
		const { username, email, role, password, active } = req.body
		let hashedPassword = password

		// Check if it's another user with the same email, but continue if the new email is same with user email
		const existingEmail = await User.findOne({ email })
		const user = await User.findById(userId)
		if (existingEmail && user.email !== email) return res.status(400).json({ message: ERROR_MESSAGES.EXISTING_EMAIL.message })

		// Check if it's another user with the same username, but continue if the new username is same with user username
		const existingUsername = await User.findOne({ username })
		if (existingUsername && user.username !== username) return res.status(400).json({ message: ERROR_MESSAGES.EXISTING_USERNAME.message })

		// Check if password is changed
		if (password) hashedPassword = await bcrypt.hash(password, 10)

		const updatedUser = await User.findByIdAndUpdate(userId, { username, email, role, active, password: hashedPassword }, { new: true })

		if (!updatedUser) return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })

		res.status(200).json({ message: SUCCESS_MESSAGES.USER.UPDATED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const deleteUser = async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: SUCCESS_MESSAGES.USER.DELETED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

module.exports = { getUsers, deleteUser, createUser, getUser, updateUser }
