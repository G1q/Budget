const User = require('../models/User')
const Budget = require('../models/Budget')
const Income = require('../models/Income')

const createIncome = async (req, res) => {
	const { date, source, budget, amount, description, user } = req.body
	try {
		// Check if the username exist
		const existingUsername = await User.findOne({ _id: user })
		if (!existingUsername) {
			return res.status(400).json({ error: 'No user with this id!' })
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
		})

		await newIncome.save()

		res.status(201).json({ message: 'Income registered successfully' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const getIncomes = async (req, res) => {
	try {
		const incomes = await Income.find({ user: req.params.id })
		if (!incomes) {
			return res.status(404).json({ error: 'Incomes not found' })
		}

		res.status(200).json(incomes)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const deleteIncome = async (req, res) => {
	const incomeId = req.params.id
	try {
		const deletedIncome = await Income.findByIdAndDelete(incomeId)
		res.status(200).json({ message: 'Income deleted successfully!' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const editIncome = async (req, res) => {
	try {
	} catch (err) {}
}

const getIncome = async (req, res) => {
	try {
	} catch (err) {}
}

module.exports = { createIncome, deleteIncome, editIncome, getIncome, getIncomes }
