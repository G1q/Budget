import React from 'react'

const CurrencySelect = ({ label = 'Currency', value, onChange }) => {
	return (
		<>
			<label htmlFor="currency">{label}</label>
			<select
				name="currency"
				id="currency"
				defaultValue={value}
				onChange={onChange}
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
