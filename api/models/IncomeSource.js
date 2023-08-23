const mongoose = require('mongoose')

const incomeSourceSchema = new mongoose.Schema(
	{
		title: {
			type: String,
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

const IncomeSource = mongoose.model('IncomeSource', incomeSourceSchema)

module.exports = IncomeSource
