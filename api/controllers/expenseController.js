const Expense = require('../models/Expense')
const User = require('../models/User')
const Budget = require('../models/Budget')

const createExpense = async (req, res) => {
	const { user, date, amount, category, subcategory, budget, description } = req.body
	try {
		// Check if the username exist
		const existingUsername = await User.findOne({ _id: user })

		if (!existingUsername) {
			return res.status(400).json({ error: 'No user with this id!' })
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
		})

		await newExpense.save()

		res.status(201).json({ message: 'Expense registered successfully' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
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
		res.status(500).json({ error: 'Internal Server Error' })
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
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const deleteExpense = async (req, res) => {
	const expenseId = req.params.id
	try {
		await Expense.findByIdAndDelete(expenseId)
		res.status(200).json({ message: 'Expense deleted successfully!' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const getExpenses = async (req, res) => {
	try {
		const expenses = await Expense.find({ user: req.params.id }).populate('budget', 'title').sort({ date: -1, createdAt: -1 })
		if (!expenses) {
			return res.status(404).json({ error: 'Expenses not found' })
		}

		res.status(200).json(expenses)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

module.exports = { createExpense, getExpense, editExpense, deleteExpense, getExpenses }
