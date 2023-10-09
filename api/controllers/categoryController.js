const Category = require('../models/Category')
const User = require('../models/User')
const { ERROR_MESSAGES } = require('../messages/errors.js')
const { SUCCESS_MESSAGES } = require('../messages/success.js')

const createCategory = async (req, res) => {
	const { title, user, subcategory } = req.body
	try {
		// Check if the username exist
		const existingUsername = await User.findOne({ _id: user })

		if (!existingUsername) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })
		}

		// Create a new category
		const newCategory = new Category({
			title,
			user,
			subcategory,
		})

		await newCategory.save()

		res.status(201).json({ message: SUCCESS_MESSAGES.CATEGORY.REGISTERED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getCategories = async (req, res) => {
	try {
		const categories = await Category.find({ user: req.params.id })
		if (!categories) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_CATEGORY_FOUND.message })
		}

		res.status(200).json(categories)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id)

		if (!category) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_CATEGORY_FOUND.message })
		}

		res.status(200).json(category)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const updateCategory = async (req, res) => {
	try {
		const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })

		if (!updatedCategory) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_CATEGORY_FOUND.message })
		}

		res.status(200).json({ message: SUCCESS_MESSAGES.CATEGORY.UPDATED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const deleteCategory = async (req, res) => {
	try {
		await Category.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: SUCCESS_MESSAGES.CATEGORY.DELETED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

module.exports = { createCategory, getCategories, getCategory, deleteCategory, updateCategory }
