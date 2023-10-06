const SUCCESS_MESSAGES = {
	BUDGET_DELETED: {
		message: 'Budget deleted successfully!',
		statusCode: 200,
	},
	BUDGET_REGISTERED: {
		message: 'Budget registered successfully!',
		statusCode: 201,
	},
	SOURCE_REGISTERED: {
		message: 'Source registered successfully!',
		statusCode: 201,
	},
	SOURCE_DELETED: {
		message: 'Income source deleted successfully!',
		statusCode: 200,
	},
	DEBT: {
		REGISTERED: {
			message: 'Debt registered successfully!',
			statusCode: 201,
		},
		UPDATED: {
			message: 'Debt updated successfully!',
			statusCode: 200,
		},
		DELETED: {
			message: 'Debt deleted successfully!',
			statusCode: 200,
		},
	},
}

module.exports = { SUCCESS_MESSAGES }
