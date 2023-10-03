const Expense = require('../models/Expense')
const User = require('../models/User')
const Budget = require('../models/Budget')
const { ERROR_MESSAGES } = require('../messages/errors.js')

const createExpense = async (req, res) => {
	const { user, date, amount, category, subcategory, budget, description } = req.body
	try {
		// Check if the username exist
		const existingUsername = await User.findOne({ _id: user })

		if (!existingUsername) {
			return res.status(400).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })
		}

		// Check if the budget exist
		const existingBudget = await Budget.findOne({ _id: budget })
		if (!existingBudget) return res.status(400).json({ error: 'No budget with this id!' })

		// Create a new expense
		const newExpense = new Expense({
			user,
			date,
			amount,
			category,
			subcategory,
			budget,
			description,
			currency: existingBudget.currency,
		})

		await newExpense.save()

		res.status(201).json({ message: 'Expense registered successfully' })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getExpense = async (req, res) => {
	try {
		const expenseId = req.params.id

		// Fetch user profile
		const expense = await Expense.findById(expenseId)
		if (!expense) {
			return res.status(404).json({ error: 'Expense not found' })
		}

		res.status(200).json(expense)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const editExpense = async (req, res) => {
	try {
		const expenseId = req.params.id

		const updatedExpense = await Expense.findByIdAndUpdate(expenseId, req.body, { new: true })

		if (!updatedExpense) {
			return res.status(404).json({ error: 'Expense not found' })
		}

		res.status(200).json(updatedExpense)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const deleteExpense = async (req, res) => {
	const expenseId = req.params.id
	try {
		await Expense.findByIdAndDelete(expenseId)
		res.status(200).json({ message: 'Expense deleted successfully!' })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getExpenses = async (req, res) => {
	const startDate = req.query.startDate
	const endDate = req.query.endDate
	const userId = req.params.id

	try {
		const isUser = await User.findById(userId)

		if (!isUser) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })
		}

		const expenses = await Expense.find({ user: userId, date: { $gte: startDate, $lte: endDate } })
			.populate('budget', 'title')
			.sort({ date: -1, createdAt: -1 })
		if (!expenses) {
			return res.status(404).json({ message: 'Expenses not found' })
		}

		res.status(200).json(expenses)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

module.exports = { createExpense, getExpense, editExpense, deleteExpense, getExpenses }
