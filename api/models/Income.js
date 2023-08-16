const mongoose = require('mongoose')

const incomeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		category: {
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

const Income = mongoose.model('Income', incomeSchema)

module.exports = Income
