const Budget = require('../models/Budget')
const User = require('../models/User')

const createBudget = async (req, res) => {
	try {
		const { title, amount, currency, description, user } = req.body

		// Check if the username exist
		const existingUsername = await User.findOne({ _id: user })

		if (!existingUsername) {
			return res.status(400).json({ error: 'No user with this id!' })
		}

		// Create a new budget
		const newBudget = new Budget({
			title,
			amount,
			currency,
			description,
			user,
		})

		await newBudget.save()

		res.status(201).json({ message: 'Budget registered successfully' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const getBudget = async (req, res) => {}

const editBudget = async (req, res) => {}

const deleteBudget = async (req, res) => {}

const getBudgets = async (req, res) => {
	try {
		const budgets = await Budget.find({ user: req.params.id })
		if (!budgets) {
			return res.status(404).json({ error: 'Budgets not found' })
		}

		res.status(200).json(budgets)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

module.exports = { createBudget, getBudget, editBudget, deleteBudget, getBudgets }
