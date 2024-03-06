// Select date interval for fetching data

/*
Ussage:
Import this function
Add useState for default: 
	a. const [dateInterval, setDateInterval] = useState({ startDate: '1970-01-01', endDate: new Date() })
	b. const [showCustom, setShowCustom] = useState(false)
Add useEffect dependencies array: [dateInterval]
Add component in page: 
	a. With custom dates: 
			<SelectInterval
				onChange={(e) => {
					setDateInterval(handleSelectIntervalChange(e))
					e.target.value === 'custom' ? setShowCustom(true) : setShowCustom(false)
				}}
				showCustom={showCustom}
			/>
*/
export const getLastDayOfMonth = (date) => {
	const nextMonthFirstDay = new Date(date.getFullYear(), date.getMonth(), 1)
	const lastDayOfMonth = new Date(nextMonthFirstDay - 1)
	return lastDayOfMonth
}

export const handleSelectIntervalChange = (e) => {
	let startDate = new Date()
	startDate.setHours(0, 0, 0, 0)
	let endDate = new Date()
	endDate.setHours(23, 59, 59, 0)
	switch (e.target.value) {
		case 'all-time':
			startDate = new Date('1970-01-01')
			break
		case 'this-year':
			startDate.setDate(1)
			startDate.setMonth(0)
			break
		case 'this-month':
			startDate.setDate(1)
			break
		case 'last-month':
			startDate.setMonth(startDate.getMonth() - 1)
			startDate.setDate(1)
			endDate = getLastDayOfMonth(endDate)
			break
		case 'today':
			break
		case 'yesterday':
			startDate.setDate(startDate.getDate() - 1)
			endDate.setDate(endDate.getDate() - 1)
			break
		case 'custom':
			// const startValue = new Date(document.querySelector('#startDate').value)
			// const endValue = new Date(document.querySelector('#endDate').value)
			// startDate.setDate(startValue.getDate())
			// startDate.setMonth(startValue.getMonth())
			// startDate.setFullYear(startValue.getFullYear())
			// endDate.setDate(endValue.getDate())
			// endDate.setMonth(endValue.getMonth())
			// endDate.setFullYear(endValue.getFullYear())
			break
		default:
			startDate = new Date('1970-01-01')
			endDate = new Date()
	}
	return {
		startDate,
		endDate,
	}
}

// Get object with first and last day of last month
export const getDatesFromLastmonth = () => {
	const today = new Date()

	const startDay = new Date()
	startDay.setDate(1)
	startDay.setMonth(today.getMonth() === 0 ? 11 : today.getMonth() - 1)
	startDay.setFullYear(today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear())
	startDay.setHours(0, 0, 0, 0)

	const endDay = new Date()
	endDay.setMonth(today.getMonth() === 0 ? 11 : today.getMonth() - 1)
	// if ([0, 2, 4, 6, 7, 9, 11].includes(endDay.getMonth())) {
	// 	endDay.setDate(31)
	// } else if ([3, 5, 8, 10].includes(endDay.getMonth())) {
	// 	endDay.setDate(30)
	// } else if ((today.getFullYear() % 4 == 0 && today.getFullYear() % 100 != 0 && endDay.getMonth() === 1) || today.getFullYear() % 400 == 0) {
	// 	endDay.setDate(29)
	// } else endDay.setDate(28)
	endDay.setDate(today.getDate())
	endDay.setFullYear(today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear())
	endDay.setHours(23, 59, 59, 0)

	return { startDay, endDay }
}
