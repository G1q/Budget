// Import dependencies
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

// Import custom elements
import LogListComponent from '../../components/LogListComponent/LogListComponent'
import StatusMessage from '../../components/StatusMessage/StatusMessage'

// Import utilities
import { getBudget } from '../../utilities/fetchData'

const LogBudget = () => {
	const { state } = useLocation()
	const id = state.id
	const [budget, setBudget] = useState('')
	const [logs, setLogs] = useState([])
	const [error, setError] = useState(null)

	useEffect(() => {
		getBudget(id)
			.then((responseData) => {
				setBudget(responseData)
				setLogs(responseData.logs)
			})
			.catch((error) => setError(error.response.data.message))
	}, [])

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
						// .sort((a, b) => new Date(a.date) - new Date(b.date))
						.map((log) => (
							<LogListComponent
								key={log._id}
								log={log}
								currency={budget.currency}
							/>
						))}
				</ul>
			)}
		</main>
	)
}

export default LogBudget
