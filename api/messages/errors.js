const ERROR_MESSAGES = {
	NO_USER_FOUND: {
		message: 'No user with this ID!',
		statusCode: 404,
	},
	INTERNAL_SERVER_ERROR: {
		message: 'Internal Server Error',
		statusCode: 500,
	},
}

module.exports = { ERROR_MESSAGES }
