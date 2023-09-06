const User = require('../models/User')
const Budget = require('../models/Budget')
const Transfer = require('../models/Transfer')

const createTransfer = async (req, res) => {
	const { user, date, amount, sourceId, sourceTitle, budgetId, budgetTitle, description } = req.body
	try {
		// Check if the username exist
		const existingUsername = await User.findOne({ _id: user })

		if (!existingUsername) {
			return res.status(400).json({ error: 'No user with this id!' })
		}

		// Check if the source and destination budget exist
		const existingSource = await Budget.findOne({ _id: sourceId })
		const existingBudget = await Budget.findOne({ _id: budgetId })
		if (!existingBudget || !existingSource) return res.status(400).json({ error: 'No budget with this id!' })

		// Create a new expense
		const newTransfer = new Transfer({
			user,
			date,
			amount,
			sourceId,
			sourceTitle,
			budgetId,
			budgetTitle,
			description,
		})

		await newTransfer.save()

		res.status(201).json({ message: 'Transfer registered successfully' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const getTransfer = async (req, res) => {
	try {
		const transferId = req.params.id

		// Fetch user profile
		const transfer = await Transfer.findById(transferId)
		if (!transfer) {
			return res.status(404).json({ error: 'Transfer not found' })
		}

		res.status(200).json(transfer)
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

const deleteTransfer = async (req, res) => {
	const transferId = req.params.id
	try {
		await Transfer.findByIdAndDelete(transferId)
		res.status(200).json({ message: 'Transfer deleted successfully!' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const getTransfers = async (req, res) => {
	try {
		const transfers = await Transfer.find({ user: req.params.id }).sort({ date: -1, createdAt: -1 })
		if (!transfers) {
			return res.status(404).json({ error: 'Transfers not found' })
		}

		res.status(200).json(transfers)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

module.exports = { createTransfer, getTransfers, deleteTransfer, getTransfer }
