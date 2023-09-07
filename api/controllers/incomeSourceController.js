const IncomeSource = require('../models/IncomeSource')
const User = require('../models/User')
const Income = require('../models/Income')
const Debt = require('../models/Debt')

const createSource = async (req, res) => {
	const { title, user } = req.body
	try {
		// Check if the username exist
		const existingUsername = await User.findOne({ _id: user })

		if (!existingUsername) {
			return res.status(400).json({ error: 'No user with this id!' })
		}

		// Check if is another source with same title for same user
		const existingSameSourceForSameUser = await IncomeSource.findOne({ title, user: existingUsername._id })
		if (existingSameSourceForSameUser) {
			return res.status(403).json({ error: 'This source was register for this user!' })
		}

		// Create a new income source
		const newIncomeSource = new IncomeSource({
			title,
			user,
		})

		await newIncomeSource.save()

		res.status(201).json({ message: 'Source registered successfully' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
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
			res.status(403).json({ error: "You can't delete this source because have transactions on it!" })
		} else {
			await IncomeSource.findByIdAndDelete(incomeSourceId)
			res.status(200).json({ message: 'Income source deleted successfully!' })
		}
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
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
