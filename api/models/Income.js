const mongoose = require('mongoose')

const incomeSchema = new mongoose.Schema(
	{
		description: {
			type: String,
		},
		amount: {
			type: Number,
			required: true,
		},
		date: {
			type: Date,
			required: true,
			default: Date.now(),
		},
		source: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'IncomeSource',
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		budget: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Budget',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

const Income = mongoose.model('Income', incomeSchema)

module.exports = Income
