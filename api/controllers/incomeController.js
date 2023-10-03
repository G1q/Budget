const User = require('../models/User')
const Budget = require('../models/Budget')
const Income = require('../models/Income')
const { ERROR_MESSAGES } = require('../messages/errors.js')

const createIncome = async (req, res) => {
	const { date, source, budget, amount, description, user } = req.body
	try {
		// Check if the username exist
		const existingUsername = await User.findOne({ _id: user })
		if (!existingUsername) {
			return res.status(400).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })
		}

		// Check if the budget exist
		const existingBudget = await Budget.findOne({ _id: budget })
		if (!existingBudget) return res.status(400).json({ error: 'No budget with this id!' })

		// Create a new income
		const newIncome = new Income({
			date,
			source,
			budget,
			amount,
			description,
			user,
			currency: existingBudget.currency,
		})

		await newIncome.save()

		res.status(201).json({ message: 'Income registered successfully' })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getIncomes = async (req, res) => {
	const startDate = req.query.startDate
	const endDate = req.query.endDate
	const userId = req.params.id

	try {
		const isUser = await User.findById(userId)

		if (!isUser) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })
		}

		const incomes = await Income.find({ user: userId, date: { $gte: startDate, $lte: endDate } })
			.populate('source', 'title')
			.populate('budget', 'title')
			.sort({ date: -1, createdAt: -1 })

		if (!incomes) {
			return res.status(404).json({ message: 'Incomes not found' })
		}

		res.status(200).json(incomes)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const deleteIncome = async (req, res) => {
	const incomeId = req.params.id
	try {
		const deletedIncome = await Income.findByIdAndDelete(incomeId)
		res.status(200).json({ message: 'Income deleted successfully!' })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const editIncome = async (req, res) => {
	try {
		const incomeId = req.params.id

		const updatedIncome = await Income.findByIdAndUpdate(incomeId, req.body, { new: true })

		if (!updatedIncome) {
			return res.status(404).json({ error: 'Income not found' })
		}

		res.status(200).json(updatedIncome)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getIncome = async (req, res) => {
	try {
		const incomeId = req.params.id

		// Fetch user profile
		const income = await Income.findById(incomeId)
		if (!income) {
			return res.status(404).json({ error: 'Income not found' })
		}

		res.status(200).json(income)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

module.exports = { createIncome, deleteIncome, editIncome, getIncome, getIncomes }
