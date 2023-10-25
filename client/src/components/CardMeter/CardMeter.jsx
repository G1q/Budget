import styled from 'styled-components'
import { amountWithDecimals } from '../../utilities/format'
import { useId } from 'react'

const BudgetMeterWrapper = styled.div`
	margin: 0;
	text-align: left;
	font-size: 0.85rem;
`

const BudgetMeterLabel = styled.label`
	margin: 0;
`

const BudgetMeter = styled.meter`
	width: 100%;
`

const CardMeter = ({ totalValue, name, currentAmount, id, currency }) => {
	const percent = Number(((currentAmount / totalValue) * 100).toFixed(2))
	const labelId = useId()

	return (
		<BudgetMeterWrapper>
			<BudgetMeterLabel
				id={labelId}
				htmlFor={id}
			>
				{`${name} (${amountWithDecimals(currentAmount, currency)})`}
			</BudgetMeterLabel>
			<BudgetMeter
				id={id}
				min={0}
				max={100}
				value={percent}
				title={`${name} represent ${percent}% of entire budget (${amountWithDecimals(currentAmount, currency)})`}
				aria-labelledby={labelId}
			>
				{name}
			</BudgetMeter>
		</BudgetMeterWrapper>
	)
}

export default CardMeter
