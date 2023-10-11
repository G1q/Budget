import React from 'react'

const LanguageSelect = ({ label = 'Select language:', value, onChange }) => {
	return (
		<>
			<label htmlFor="language">{label}</label>
			<select
				name="language"
				id="language"
				defaultValue={value}
				onChange={onChange}
			>
				<option value="en">English</option>
				<option value="ro">Romana</option>
			</select>
		</>
	)
}

export default LanguageSelect
