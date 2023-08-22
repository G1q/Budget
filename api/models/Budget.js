const mongoose = require('mongoose')

const budgetSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		title: {
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

const Budget = mongoose.model('Budget', budgetSchema)

module.exports = Budget
