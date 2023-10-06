import React from 'react'

const CurrencySelect = () => {
	return (
		<>
			<label htmlFor="currency">Currency</label>
			<select
				name="currency"
				id="currency"
			>
				<option value="RON">RON</option>
				<option
					value="EUR"
					disabled
				>
					EUR
				</option>
				<option
					value="USD"
					disabled
				>
					USD
				</option>
				<option
					value="GBP"
					disabled
				>
					GBP
				</option>
			</select>
		</>
	)
}

export default CurrencySelect
