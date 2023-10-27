import { amountWithDecimals } from './format'

export const getTotal = (arr) => {
	let total = 0
	let currency
	for (let i = 0; i < arr.length; i++) {
		arr[i].currentAmount !== undefined ? (total += arr[i].currentAmount) : (total += arr[i].amount)
		currency = arr[i].currency
	}
	return amountWithDecimals(total, currency)
}

export const sumPerCategory = (expenses, categories, lastMonth) => {
	const res = []
	for (let i = 0; i < categories.length; i++) {
		res.push({ title: categories[i], total: 0, last: 0 })
	}

	expenses.forEach((expense) => {
		for (let i = 0; i < res.length; i++) {
			if (expense.category === res[i].title) {
				res[i].total = parseFloat((res[i].total + expense.amount).toFixed(2))
			}
		}
	})

	lastMonth.forEach((expense) => {
		for (let i = 0; i < res.length; i++) {
			if (expense.category === res[i].title) {
				res[i].last = parseFloat((res[i].last + expense.amount).toFixed(2))
			}
		}
	})

	return res
}
