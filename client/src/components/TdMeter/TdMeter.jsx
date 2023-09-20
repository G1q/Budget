import { styled } from 'styled-components'
import { amountWithDecimals } from '../../utilities/format'

const TdTableCellMeter = styled.td`
	background: linear-gradient(to right, ${(props) => props.color} ${(props) => props.meter}%, transparent ${(props) => props.meter}%);
`

const TdMeter = ({ amount, target, currency }) => {
	const meter = (Number(amount) / Number(target)) * 100

	let color = '#00ff7355' // over 70%
	if (meter < 25) color = '#dc143c55'
	if (meter >= 25 && meter < 70) color = '#f6f92a88'

	return (
		<TdTableCellMeter
			meter={meter}
			color={color}
		>
			{target ? amountWithDecimals(target, currency) : '-'}
		</TdTableCellMeter>
	)
}

export default TdMeter

// <td>{budget.targetAmount ? `${budget.targetAmount.toFixed(2)} ${budget.currency}` : '-'}</td>

// ${props => props.element}
