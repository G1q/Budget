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
