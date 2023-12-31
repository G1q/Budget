const Budget = require('../models/Budget')
const User = require('../models/User')
const Income = require('../models/Income')
const Expense = require('../models/Expense')
const { ERROR_MESSAGES } = require('../messages/errors.js')
const { SUCCESS_MESSAGES } = require('../messages/success.js')

const createBudget = async (req, res) => {
	try {
		const { title, startAmount, targetAmount, currency, description, user } = req.body

		// Check if the username exist
		const existingUsername = await User.findById(user)

		if (!existingUsername) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })
		}

		// Create a new budget
		const logBudget = {
			date: new Date(),
			currentAmount: startAmount,
			type: 'created',
		}

		const newBudget = new Budget({
			title,
			startAmount,
			currentAmount: startAmount,
			targetAmount: targetAmount || 0,
			currency,
			description,
			user,
		})

		newBudget.logs.push(logBudget)

		await newBudget.save()

		res.status(201).json({ message: SUCCESS_MESSAGES.BUDGET.REGISTERED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getBudgets = async (req, res) => {
	try {
		const isUser = await User.findById(req.params.id)

		if (!isUser) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })
		}

		const budgets = await Budget.find({ user: req.params.id })
		if (!budgets) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_BUDGETS.message })
		}

		res.status(200).json(budgets)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getBudget = async (req, res) => {
	try {
		const budget = await Budget.findById(req.params.id)
		if (!budget) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_BUDGET_FOUND.message })
		}

		res.status(200).json(budget)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const updateBudget = async (req, res) => {
	try {
		const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true })

		if (!updatedBudget) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_BUDGET_FOUND.message })
		}

		res.status(200).json({ message: SUCCESS_MESSAGES.BUDGET.UPDATED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const deleteBudget = async (req, res) => {
	try {
		const budget = await Budget.findById(req.params.id)

		if (!budget) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_BUDGET_FOUND.message })
		}

		const referencedIncomes = await Income.countDocuments({ budget: req.params.id })
		const referencedExpenses = await Expense.countDocuments({ budget: req.params.id })

		if (referencedIncomes > 0 || referencedExpenses > 0) {
			// Check if budget have transaction on it
			res.status(403).json({ message: ERROR_MESSAGES.USED_BUDGET.message })
		} else if (budget.currentAmount > 0) {
			// Check if budget have amount bigger than 0
			res.status(403).json({ message: ERROR_MESSAGES.NO_EMPTY_BUDGET.message })
		} else {
			// Delete budget if haven't any transactions
			await Budget.findByIdAndDelete(req.params.id)
			res.status(200).json({ message: SUCCESS_MESSAGES.BUDGET.DELETED.message })
		}
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

module.exports = { createBudget, getBudget, updateBudget, deleteBudget, getBudgets }
