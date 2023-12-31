const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		subcategory: {
			type: String,
			default: 'General',
		},
	},
	{
		timestamps: true,
	}
)

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
