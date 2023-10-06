const User = require('../models/User')
const Budget = require('../models/Budget')
const Income = require('../models/Income')
const { ERROR_MESSAGES } = require('../messages/errors.js')
const { SUCCESS_MESSAGES } = require('../messages/success.js')

const createIncome = async (req, res) => {
	const { date, source, budget, amount, description, user } = req.body
	try {
		// Check if the username exist
		const existingUsername = await User.findOne({ _id: user })
		if (!existingUsername) return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })

		// Check if the budget exist
		const existingBudget = await Budget.findOne({ _id: budget })
		if (!existingBudget) return res.status(404).json({ message: ERROR_MESSAGES.NO_BUDGET_FOUND.message })

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

		res.status(201).json({ message: SUCCESS_MESSAGES.INCOME.REGISTERED.message })
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

		if (!isUser) return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })

		const incomes = await Income.find({ user: userId, date: { $gte: startDate, $lte: endDate } })
			.populate('source', 'title')
			.populate('budget', 'title')
			.sort({ date: -1, createdAt: -1 })

		if (!incomes) return res.status(404).json({ message: ERROR_MESSAGES.NO_INCOME_FOUND.message })

		res.status(200).json(incomes)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getIncome = async (req, res) => {
	try {
		const income = await Income.findById(req.params.id)

		if (!income) return res.status(404).json({ message: ERROR_MESSAGES.NO_INCOME_FOUND.message })

		res.status(200).json(income)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const updateIncome = async (req, res) => {
	try {
		const updatedIncome = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true })

		if (!updatedIncome) return res.status(404).json({ message: ERROR_MESSAGES.NO_INCOME_FOUND.message })

		res.status(200).json({ message: SUCCESS_MESSAGES.INCOME.UPDATED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const deleteIncome = async (req, res) => {
	try {
		await Income.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: SUCCESS_MESSAGES.INCOME.DELETED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

module.exports = { createIncome, deleteIncome, updateIncome, getIncome, getIncomes }
