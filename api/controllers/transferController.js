const User = require('../models/User')
const Budget = require('../models/Budget')
const Transfer = require('../models/Transfer')
const { ERROR_MESSAGES } = require('../messages/errors.js')
const { SUCCESS_MESSAGES } = require('../messages/success.js')

const createTransfer = async (req, res) => {
	const { user, date, amount, sourceId, sourceTitle, budgetId, budgetTitle, description } = req.body
	try {
		// Check if the username exist
		const existingUsername = await User.findById(user)

		if (!existingUsername) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })
		}

		// Check if the source and destination budget exist
		const existingSource = await Budget.findById(sourceId)
		const existingBudget = await Budget.findById(budgetId)
		if (!existingBudget || !existingSource) return res.status(404).json({ message: ERROR_MESSAGES.NO_SOME_BUDGET.message })

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
			currency: existingSource.currency,
		})

		await newTransfer.save()

		res.status(201).json({ message: SUCCESS_MESSAGES.TRANSFER.REGISTERED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getTransfers = async (req, res) => {
	const startDate = req.query.startDate
	const endDate = req.query.endDate

	try {
		const transfers = await Transfer.find({ user: req.params.id, date: { $gte: startDate, $lte: endDate } }).sort({ date: -1, createdAt: -1 })
		if (!transfers) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_TRANSFER_FOUND.message })
		}

		res.status(200).json(transfers)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getTransfer = async (req, res) => {
	try {
		const transfer = await Transfer.findById(req.params.id)

		if (!transfer) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_TRANSFER_FOUND.message })
		}

		res.status(200).json(transfer)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const updateTransfer = async (req, res) => {
	try {
		const updatedTransfer = await Transfer.findByIdAndUpdate(req.params.id, req.body, { new: true })

		if (!updatedTransfer) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_TRANSFER_FOUND.message })
		}

		res.status(200).json({ message: SUCCESS_MESSAGES.TRANSFER.UPDATED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const deleteTransfer = async (req, res) => {
	try {
		await Transfer.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: SUCCESS_MESSAGES.TRANSFER.DELETED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

module.exports = { createTransfer, getTransfers, deleteTransfer, getTransfer, updateTransfer }
