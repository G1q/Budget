import axiosInstance from './axiosconfig'

export const fetchBudgets = async (id) => {
	try {
		const response = await axiosInstance.get(`budgets/${id}`)
		return response.data
	} catch (error) {
		throw error
	}
}

export const fetchIncomes = async (id, params = {}) => {
	try {
		const response = await axiosInstance.get(`incomes/${id}`, { params })
		return response.data
	} catch (error) {
		throw error
	}
}

export const fetchExpenses = async (id, params = {}) => {
	try {
		const response = await axiosInstance.get(`expenses/${id}`, { params })
		return response.data
	} catch (error) {
		throw error
	}
}

export const fetchDebts = async (id) => {
	try {
		const response = await axiosInstance.get(`debts/${id}`)
		return response.data
	} catch (error) {
		throw error
	}
}

export const fetchTransactions = async (id, params = {}) => {
	try {
		const incomes = await axiosInstance.get(`incomes/${id}`, { params })
		const expenses = await axiosInstance.get(`expenses/${id}`, { params })

		return incomes.data.concat(expenses.data)
	} catch (error) {
		throw error
	}
}

export const fetchCategories = async (id) => {
	// Only unique categories
	try {
		const response = await axiosInstance.get(`/categories/${id}`)
		return [...new Set(response.data.map((cat) => cat.title))]
	} catch (error) {
		throw error
	}
}

export const fetchAllCategories = async (id) => {
	// All categories
	try {
		const response = await axiosInstance.get(`/categories/${id}`)
		return response.data
	} catch (error) {
		throw error
	}
}

export const fetchSources = async (id) => {
	try {
		const response = await axiosInstance(`/incomes/source/${id}`)
		return response.data
	} catch (error) {
		throw error
	}
}

export const getDebt = async (id) => {
	try {
		const response = await axiosInstance(`/debts/view/${id}`)
		return response.data
	} catch (error) {
		throw error
	}
}

export const getBudget = async (id) => {
	try {
		const response = await axiosInstance.get(`budgets/view/${id}`)
		return response.data
	} catch (error) {
		throw error
	}
}

export const getIncome = async (id) => {
	try {
		const response = await axiosInstance.get(`incomes/view/${id}`)
		return response.data
	} catch (error) {
		throw error
	}
}

export const getExpense = async (id) => {
	try {
		const response = await axiosInstance.get(`expenses/view/${id}`)
		return response.data
	} catch (error) {
		throw error
	}
}

export const getSubcategories = async (category, userId) => {
	try {
		const response = await axiosInstance.get(`/categories/${userId}`)
		return [...new Set(response.data.filter((cat) => cat.title === category).map((cat) => cat.subcategory))]
	} catch (error) {
		throw error
	}
}
