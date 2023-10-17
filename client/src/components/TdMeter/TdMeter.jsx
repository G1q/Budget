import { styled } from 'styled-components'
import { amountWithDecimals } from '../../utilities/format'

const TdTableCellMeter = styled.td`
	background: linear-gradient(to right, ${(props) => props.color} ${(props) => props.meter}%, transparent ${(props) => props.meter}%);
`

const TdMeter = ({ amount, target, currency }) => {
	const meter = (Number(amount) / Number(target)) * 100

	let color = 'hsla(120, 61%, 34%, .5)' // over 70%
	if (meter < 25) color = 'hsla(348, 83%, 47%, .5)'
	if (meter >= 25 && meter < 70) color = 'hsla(60, 100%, 50%, .5)'

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
