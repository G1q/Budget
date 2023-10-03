import axiosInstance from './axiosconfig'

export const fetchBudgets = async (id) => {
	try {
		const response = await axiosInstance.get(`budgets/${id}`)
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

export const fetchTransactions = async (id) => {
	try {
		const incomes = await axiosInstance(`incomes/${id}`, { params: { startDate: '1970-01-01', endDate: new Date() } })
		const expenses = await axiosInstance(`expenses/${id}`, { params: { startDate: '1970-01-01', endDate: new Date() } })

		return incomes.data.concat(expenses.data)
	} catch (error) {
		throw error
	}
}
