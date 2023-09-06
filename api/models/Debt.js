const mongoose = require('mongoose')

const debtSchema = new mongoose.Schema(
	{
		amount: {
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
	},
	{
		timestamps: true,
	}
)

const Debt = mongoose.model('Debt', debtSchema)

module.exports = Debt
