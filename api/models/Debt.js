const mongoose = require('mongoose')

const debtSchema = new mongoose.Schema(
	{
		currentAmount: {
			type: Number,
			required: true,
		},
		startAmount: {
			type: Number,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		description: {
			type: String,
		},
		creditor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'IncomeSource',
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

const Debt = mongoose.model('Debt', debtSchema)

module.exports = Debt
