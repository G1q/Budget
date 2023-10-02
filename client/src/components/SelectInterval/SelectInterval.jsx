import React from 'react'

const SelectInterval = ({ onChange }) => {
	return (
		<div
			className="select__interval"
			style={{ display: 'flex', alignItems: 'center' }}
		>
			<label htmlFor="selectInterval">Select date</label>
			<select
				name="selectInterval"
				id="selectInterval"
				onChange={onChange}
			>
				<option value="all-time">All time</option>
				<option value="this-year">This year</option>
				<option value="this-month">This month</option>
				<option value="last-month">Last month</option>
				<option value="today">Today</option>
				<option value="yesterday">Yesterday</option>
				<option value="custom">Custom (in progress...)</option>
			</select>
		</div>
	)
}

export default SelectInterval
