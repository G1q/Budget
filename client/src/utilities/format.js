export const amountWithDecimals = (number, currency = '') => {
	if (number == 0) return 0
	return `${number.toFixed(2).replace(/[.,]00/, '')} ${currency}`
}
