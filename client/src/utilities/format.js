// Return amount with currency, with 2 decimals
export const amountWithDecimals = (number, currency = '') => {
	if (number == 0) return 0
	return `${number.toFixed(2).replace(/[.,]00/, '')} ${currency}`
}

// Return data in format DD-MM-YYYY
export const formatDate = (date) => {
	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const year = date.getFullYear()

	return `${day}-${month}-${year}`
}

// Return date in format YYYY-MM-DD for input:date
export const formatInputDate = (date) => {
	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const year = date.getFullYear()

	return `${year}-${month}-${day}`
}
