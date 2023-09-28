const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ['user', 'admin', 'superadmin'],
			default: 'user',
		},
		active: {
			type: Boolean,
			default: false,
		},
		settings: {
			language: {
				type: String,
				default: 'en',
			},
			currencies: {
				type: String,
				default: 'RON',
			},
			pagination: {
				type: String,
				default: 15,
			},
			theme: {
				type: String,
				default: 'light',
			},
		},
	},
	{
		timestamps: true,
	}
)

const User = mongoose.model('User', userSchema)

module.exports = User
