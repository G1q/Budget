const Debt = require('../models/Debt')
const User = require('../models/User')
const IncomeSource = require('../models/IncomeSource')

const createDebt = async (req, res) => {
	const { user, date, startAmount, currentAmount, creditor, description } = req.body
	try {
		// Check if the username exist
		const existingUsername = await User.findById(user)

		if (!existingUsername) {
			return res.status(400).json({ error: 'No user with this id!' })
		}

		// Check if creditor was created
		const existingCreditor = await IncomeSource.findById(creditor)

		if (!existingCreditor) {
			return res.status(400).json({ error: 'No creditor with this id!' })
		}

		// Create a new debt
		const newDebt = new Debt({
			user,
			date,
			startAmount,
			currentAmount: startAmount,
			creditor,
			description,
		})

		await newDebt.save()

		res.status(201).json({ message: 'Debt registered successfully' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const getDebt = async (req, res) => {
	try {
		const debtId = req.params.id

		// Fetch user profile
		const debt = await Debt.findById(debtId)
		if (!debt) {
			return res.status(404).json({ error: 'Debt not found' })
		}

		res.status(200).json(debt)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const editDebt = async (req, res) => {
	try {
		const debtId = req.params.id

		const updatedDebt = await Debt.findByIdAndUpdate(debtId, req.body, { new: true })

		if (!updatedDebt) {
			return res.status(404).json({ error: 'Debt not found' })
		}

		res.status(200).json(updatedDebt)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const deleteDebt = async (req, res) => {
	const debtid = req.params.id
	try {
		await Debt.findByIdAndDelete(debtid)
		res.status(200).json({ message: 'Debt deleted successfully!' })
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const getDebts = async (req, res) => {
	try {
		const debts = await Debt.find({ user: req.params.id }).populate('creditor', 'title').sort({ date: -1, createdAt: -1 })
		if (!debts) {
			return res.status(404).json({ error: 'Debts not found' })
		}

		res.status(200).json(debts)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

module.exports = { createDebt, getDebt, editDebt, deleteDebt, getDebts }
