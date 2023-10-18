// Import dependencies
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

// Import custom elements
import LogListComponent from '../../components/LogListComponent/LogListComponent'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import Pagination from '../../components/Pagination/Pagination'

// Import utilities
import { getBudget } from '../../utilities/fetchData'

const ITEMS_PER_PAGE = 10

const LogBudget = () => {
	const { state } = useLocation()
	const id = state.id
	const [budget, setBudget] = useState('')
	const [logs, setLogs] = useState([])
	const [error, setError] = useState(null)
	const [startItem, setStartItem] = useState(0)
	const [endItem, setEndItem] = useState(ITEMS_PER_PAGE)

	useEffect(() => {
		getBudget(id)
			.then((responseData) => {
				setBudget(responseData)
				setLogs(responseData.logs)
			})
			.catch((error) => setError(error.response.data.message))
	}, [])

	const handleNextButton = () => {
		setStartItem((prev) => prev + ITEMS_PER_PAGE)
		setEndItem((prev) => prev + ITEMS_PER_PAGE)
	}

	const handlePrevButton = () => {
		setStartItem((prev) => prev - ITEMS_PER_PAGE)
		setEndItem((prev) => prev - ITEMS_PER_PAGE)
	}

	return (
		<main>
			<h1>Log budget {budget.title}</h1>
			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}
			<Link to="/budgets">Back to budgets list</Link>
			{logs.length > 0 && (
				<ul style={{ fontSize: '.875rem' }}>
					{logs
						.sort((a, b) => new Date(b.date) - new Date(a.date))
						.slice(startItem, endItem)
						.map((log) => (
							<LogListComponent
								key={log._id}
								log={log}
								currency={budget.currency}
							/>
						))}
				</ul>
			)}
			<Pagination
				startIndex={startItem}
				endIndex={endItem}
				dataArray={logs}
				numberOfItemsPerPage={ITEMS_PER_PAGE}
				onClickNext={handleNextButton}
				onClickPrev={handlePrevButton}
			/>
		</main>
	)
}

export default LogBudget
