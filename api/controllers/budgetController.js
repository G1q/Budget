const Budget = require('../models/Budget')
const User = require('../models/User')

const createBudget = async (req, res) => {
	try {
		const { title, startAmount, targetAmount, currency, description, user } = req.body

		// Check if the username exist
		const existingUsername = await User.findOne({ _id: user })

		if (!existingUsername) {
			return res.status(400).json({ error: 'No user with this id!' })
		}

		// Create a new budget
		const newBudget = new Budget({
			title,
			startAmount,
			currentAmount: startAmount,
			targetAmount,
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

const getBudget = async (req, res) => {
	try {
		const budgetId = req.params.id

		// Fetch user profile
		const budget = await Budget.findById(budgetId)
		if (!budget) {
			return res.status(404).json({ error: 'Budget not found' })
		}

		res.status(200).json(budget)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const editBudget = async (req, res) => {
	try {
		const budgetId = req.params.id

		const updatedBudget = await Budget.findByIdAndUpdate(budgetId, req.body, { new: true })

		if (!updatedBudget) {
			return res.status(404).json({ error: 'Budget not found' })
		}

		res.status(200).json(updatedBudget)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const deleteBudget = async (req, res) => {
	const budgetId = req.params.id
	try {
		const budgetToDelete = Budget.findById({ _id: budgetId }) // TODO: put amount in general budget

		const deletedBudget = await Budget.findByIdAndDelete(budgetId)
		res.status(200).json({ message: 'Budget deleted successfully!' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

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
