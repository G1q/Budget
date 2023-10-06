const Debt = require('../models/Debt')
const User = require('../models/User')
const IncomeSource = require('../models/IncomeSource')
const { ERROR_MESSAGES } = require('../messages/errors.js')
const { SUCCESS_MESSAGES } = require('../messages/success.js')

const createDebt = async (req, res) => {
	const { user, date, startAmount, creditor, description, currency } = req.body
	try {
		// Check if the username exist
		const existingUsername = await User.findById(user)

		if (!existingUsername) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })
		}

		// Check if creditor was created
		const existingCreditor = await IncomeSource.findById(creditor)

		if (!existingCreditor) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_CREDITOR_FOUND.message })
		}

		// Create a new debt
		const newDebt = new Debt({
			user,
			date,
			startAmount,
			currentAmount: startAmount,
			creditor,
			description,
			currency,
		})

		await newDebt.save()

		res.status(201).json({ message: SUCCESS_MESSAGES.DEBT.REGISTERED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getDebts = async (req, res) => {
	try {
		const isUser = await User.findById(req.params.id)

		if (!isUser) return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })

		const debts = await Debt.find({ user: req.params.id }).populate('creditor', 'title').sort({ date: -1, createdAt: -1 })

		if (!debts) return res.status(404).json({ message: ERROR_MESSAGE.NO_DEBT_FOUND.message })

		res.status(200).json(debts)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getDebt = async (req, res) => {
	try {
		const debt = await Debt.findById(req.params.id)
		if (!debt) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_DEBT_FOUND.message })
		}

		res.status(200).json(debt)
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const updateDebt = async (req, res) => {
	try {
		const updatedDebt = await Debt.findByIdAndUpdate(req.params.id, req.body, { new: true })

		if (!updatedDebt) return res.status(404).json({ message: ERROR_MESSAGES.NO_DEBT_FOUND.message })

		res.status(200).json({ message: SUCCESS_MESSAGES.DEBT.UPDATED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const deleteDebt = async (req, res) => {
	try {
		const deletedDebt = await Debt.findByIdAndDelete(req.params.id)

		if (!deletedDebt) return res.status(404).json({ message: ERROR_MESSAGES.NO_DEBT_FOUND.message })

		res.status(200).json({ message: SUCCESS_MESSAGES.DEBT.DELETED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

module.exports = { createDebt, getDebt, updateDebt, deleteDebt, getDebts }
