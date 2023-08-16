const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema(
	{
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
		subcategory: {
			type: String,
			default: 'General',
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		notes: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
)

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense
