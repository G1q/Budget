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
		case 'changed-budget-income':
			text = `Edit income from this budget (-${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'new-budget-income':
			text = `Edit income from another budget (+${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'new-amount-income':
			text = `Edit income amount (+${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'deleted-income':
			text = `Delete income (-${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'changed-budget-expense':
			text = `Edit expense from this budget (+${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'new-budget-expense':
			text = `Edit expense from another budget (-${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'new-amount-expense':
			text = `Edit expense amount (-${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'deleted-expense':
			text = `Delete expense (+${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'changed-destination-budget':
			text = `Edit transfer to another destination budget (-${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'new-destination-budget':
			text = `Edit transfer from another destination budget (+${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'changed-source-budget':
			text = `Edit transfer from another source budget (+${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'new-source-budget':
			text = `Edit transfer to another source budget (-${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'new-transfer-destination-amount':
			text = `Edit transfer amount (+${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'new-transfer-source-amount':
			text = `Edit transfer (-${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'deleted-transfer-source':
			text = `Delete transfer (+${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'deleted-transfer-destination':
			text = `Delete transfer (-${log.modifiedAmount} ${currency})`
			color = '#634d07'
			break
		case 'update':
			text = `Update budget info`
			color = '#490573'
			break
		case 'update-title':
			text = `Update budget title`
			color = '#490574'
			break
		case 'update-currency':
			text = `Update budget currency`
			color = '#490574'
			break
		case 'update-amount':
			text = `Update budget amount`
			color = '#490574'
			break
		case 'update-description':
			text = `Update budget description`
			color = '#490574'
			break
		default:
			color = '#333'
	}

	return (
		<li style={{ marginBottom: '.5rem', color: color }}>{`[${formatFullDate(new Date(log.date))}]: ${text} - current amount: ${amountWithDecimals(
			log.currentAmount,
			currency
		)}`}</li>
	)
}

export default LogListComponent
