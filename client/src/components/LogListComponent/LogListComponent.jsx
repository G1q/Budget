import { amountWithDecimals, formatFullDate } from '../../utilities/format'

const LogListComponent = ({ log, currency }) => {
	let text = ''
	let color = '#333'

	switch (log.type) {
		case 'created':
			text = 'Budget created'
			color = '#0744a6'
			break
		case 'expense':
			text = `Create expense (-${log.modifiedAmount} ${currency})`
			color = 'crimson'
			break
		case 'income':
			text = `Create income (+${log.modifiedAmount} ${currency})`
			color = 'forestgreen'
			break
		case 'transfer-source':
			text = `Create transfer to another budget (-${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'transfer-destination':
			text = `Create transfer from another budget (+${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'update':
			text = `Update budget info`
			color = '#490573'
			break
		default:
			color = '#333'
	}

	return (
		<li style={{ marginBottom: '.5rem', color: color }}>{`[${formatFullDate(new Date(log.date))}]: ${text} - new amount: ${amountWithDecimals(
			log.currentAmount,
			currency
		)}`}</li>
	)
}

export default LogListComponent
