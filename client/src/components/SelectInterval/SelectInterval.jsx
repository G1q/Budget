import { useState } from 'react'
import { formatInputDate } from '../../utilities/format'

const SelectInterval = ({ onChange, label, showCustom }) => {
	return (
		<div
			className="select__interval"
			style={{ display: 'grid', alignItems: 'center', gridTemplateColumns: 'auto 1fr', gap: '.5rem' }}
		>
			<label htmlFor="selectInterval">{label}</label>
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

			<div
				className="custom-dates"
				style={showCustom ? { display: 'block' } : { display: 'none' }}
			>
				<label htmlFor="startDate">Start date</label>
				<input
					type="date"
					name="startDate"
					id="startDate"
					defaultValue={'2023-01-01'}
					onChange={onChange}
				/>
				<label htmlFor="endDate">End date</label>
				<input
					type="date"
					name="endDate"
					id="endDate"
					defaultValue={formatInputDate(new Date())}
					onChange={onChange}
				/>
			</div>
		</div>
	)
}

export default SelectInterval
