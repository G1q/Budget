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
			default: Date.now(),
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
		description: {
			type: String,
		},
		budget: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Budget',
			required: true,
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

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense
