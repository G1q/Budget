const IncomeSource = require('../models/IncomeSource')
const User = require('../models/User')

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
		const deletedIncomeSource = await IncomeSource.findByIdAndDelete(incomeSourceId)
		res.status(200).json({ message: 'Income source deleted successfully!' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

module.exports = { createSource, deleteSource, getSources }
