export const amountWithDecimals = (number, currency = '') => {
	if (number == 0) currency = ''
	return `${number.toFixed(2).replace(/[.,]00/, '')} ${currency}`
}
