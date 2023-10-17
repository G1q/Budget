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
