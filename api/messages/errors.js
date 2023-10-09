const ERROR_MESSAGES = {
	NO_USER_FOUND: {
		message: 'No user with this ID!',
		statusCode: 404,
	},
	INTERNAL_SERVER_ERROR: {
		message: 'Internal Server Error',
		statusCode: 500,
	},
	USED_BUDGET: {
		message: "You can't delete this budget because have transactions on it!",
		statusCode: 403,
	},
	NO_EMPTY_BUDGET: {
		message: "You can't delete this budget because have amount grater than 0. First, transfer all amounts to another budget!",
		statusCode: 403,
	},
	NO_BUDGET_FOUND: {
		message: 'Budget not found!',
		statusCode: 404,
	},
	NO_USER_BUDGETS: {
		message: 'Budgets not found for this user!',
		statusCode: 404,
	},
	EXISTING_SOURCE: {
		message: 'This source was register for this user!',
		statusCode: 403,
	},
	USED_SOURCE: {
		message: "You can't delete this source because have transactions on it!",
		statusCode: 403,
	},
	NO_CREDITOR_FOUND: {
		message: 'No creditor with this id!',
		statusCode: 404,
	},
	NO_DEBT_FOUND: {
		message: 'No debt found with this id!',
		statusCode: 404,
	},
	NO_INCOME_FOUND: {
		message: 'No incomes found!',
		statusCode: 404,
	},
	NO_EXPENSE_FOUND: {
		message: 'No expenses found!',
		statusCode: 404,
	},
	NO_CATEGORY_FOUND: {
		message: 'No category found!',
		statusCode: 404,
	},
}

module.exports = { ERROR_MESSAGES }
