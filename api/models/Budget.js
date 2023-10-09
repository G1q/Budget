const mongoose = require('mongoose')

const budgetSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		startAmount: {
			type: Number,
			required: true,
		},
		currentAmount: {
			type: Number,
		},
		targetAmount: {
			type: Number,
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
		logs: [
			{
				date: {
					type: Date,
					default: Date.now(),
				},
				currentAmount: {
					type: Number,
				},
				modifiedAmount: {
					type: Number,
				},
				type: {
					type: String,
				},
			},
		],
	},
	{
		timestamps: true,
	}
)

const Budget = mongoose.model('Budget', budgetSchema)

module.exports = Budget
