const IncomeSource = require('../models/IncomeSource')
const User = require('../models/User')
const Income = require('../models/Income')
const Debt = require('../models/Debt')
const { ERROR_MESSAGES } = require('../messages/errors.js')
const { SUCCESS_MESSAGES } = require('../messages/succes.js')

const createSource = async (req, res) => {
	const { title, user } = req.body
	try {
		// Check if the username exist
		const isUser = await User.findById(user)

		if (!isUser) {
			return res.status(404).json({ message: ERROR_MESSAGES.NO_USER_FOUND.message })
		}

		// Check if is another source with same title for same user
		const existingSameSourceForSameUser = await IncomeSource.findOne({ title, user })
		if (existingSameSourceForSameUser) {
			return res.status(403).json({ message: ERROR_MESSAGES.EXISTING_SOURCE.message })
		}

		// Create a new income source
		const newIncomeSource = new IncomeSource({
			title,
			user,
		})

		await newIncomeSource.save()

		res.status(201).json({ message: SUCCESS_MESSAGES.SOURCE_REGISTERED.message })
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getSources = async (req, res) => {
	try {
		const incomeSources = await IncomeSource.find({ user: req.params.id })
		if (!incomeSources) {
			return res.status(404).json({ error: 'Income source not found' })
		}

		res.status(200).json(incomeSources)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const deleteSource = async (req, res) => {
	const incomeSourceId = req.params.id
	try {
		const referencedIncomes = await Income.countDocuments({ source: incomeSourceId })
		const referencedDebts = await Debt.countDocuments({ creditor: incomeSourceId })

		if (referencedIncomes > 0 || referencedDebts > 0) {
			// Check if source has been used to some incomes
			res.status(403).json({ message: ERROR_MESSAGES.USED_SOURCE.message })
		} else {
			await IncomeSource.findByIdAndDelete(incomeSourceId)
			res.status(200).json({ message: SUCCESS_MESSAGES.SOURCE_DELETED.message })
		}
	} catch (error) {
		res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message })
	}
}

const getSource = async (req, res) => {
	try {
		const incomeSource = await IncomeSource.findById(req.params.id)
		res.status(200).json(incomeSource)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const editSource = async (req, res) => {
	try {
		const sourceId = req.params.id

		const updatedSource = await IncomeSource.findByIdAndUpdate(sourceId, req.body, { new: true })

		if (!updatedSource) {
			return res.status(404).json({ error: 'Source not found' })
		}

		res.status(200).json(updatedSource)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

module.exports = { createSource, deleteSource, getSources, getSource, editSource }
