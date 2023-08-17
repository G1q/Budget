const User = require('../models/User')

const getUsers = async (req, res) => {
	try {
		const users = await User.find({}).select('-password')
		if (!users) {
			return res.status(404).json({ error: 'Users not found' })
		}

		res.status(200).json(users)
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

module.exports = { getUsers }
