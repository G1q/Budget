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
		source: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Budget',
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

const Transfer = mongoose.model('Transfer', transferSchema)

module.exports = Transfer
