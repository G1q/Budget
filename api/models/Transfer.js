const mongoose = require('mongoose')

const transferSchema = new mongoose.Schema(
	{
		amount: {
			type: Number,
			required: true,
		},
		date: {
			type: Date,
			required: true,
			default: Date.now(),
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		sourceId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Budget',
		},
		sourceTitle: {
			type: String,
			required: true,
		},
		budgetId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Budget',
		},
		budgetTitle: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		currency: {
			type: String,
			default: 'RON',
		},
	},
	{
		timestamps: true,
	}
)

const Transfer = mongoose.model('Transfer', transferSchema)

module.exports = Transfer
