// Select date interval for fetching data

/*
Ussage:
Import this function
Add useState for default: const [dateInterval, setDateInterval] = useState({ startDate: '1970-01-01', endDate: new Date() })
Add useEffect dependencies array: [dateInterval]
Add component in page: <SelectInterval onChange={(e) => setDateInterval(handleSelectIntervalChange(e))} />
*/
export const handleSelectIntervalChange = (e) => {
	const getLastDayOfMonth = (date) => {
		const nextMonthFirstDay = new Date(date.getFullYear(), date.getMonth(), 1)
		const lastDayOfMonth = new Date(nextMonthFirstDay - 1)
		return lastDayOfMonth
	}

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
			startDate = new Date('1970-01-01')
			endDate = new Date()
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
