const Category = require('../models/Category')
const User = require('../models/User')

const createCategory = async (req, res) => {
	const { title, user, subcategories } = req.body
	try {
		// Check if the username exist
		const existingUsername = await User.findOne({ _id: user })

		if (!existingUsername) {
			return res.status(400).json({ error: 'No user with this id!' })
		}

		// Check if is another category with same title for same user
		const existingSameCategoryForSameUser = await Category.findOne({ title, user: existingUsername._id })
		if (existingSameCategoryForSameUser) {
			return res.status(403).json({ error: 'This category was register for this user!' })
		}

		// Create a new category
		const newCategory = new Category({
			title,
			user,
		})

		await newCategory.save()

		res.status(201).json({ message: 'Category registered successfully' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const getCategories = async (req, res) => {
	try {
		const categories = await Category.find({ user: req.params.id })
		if (!categories) {
			return res.status(404).json({ error: 'Category not found' })
		}

		res.status(200).json(categories)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const deleteCategory = async (req, res) => {
	const categoryId = req.params.id
	try {
		const deletedCategory = await Category.findByIdAndDelete(categoryId)
		res.status(200).json({ message: 'Category deleted successfully!' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const getCategory = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id)
		res.status(200).json(category)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

module.exports = { createCategory, getCategories, getCategory, deleteCategory }
