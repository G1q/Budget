import { useEffect, useState } from 'react'
import './LogBudget.css'

import { Link, useParams } from 'react-router-dom'
import { getBudget } from '../../../utilities/fetchData'
import { amountWithDecimals, formatFullDate } from '../../../utilities/format'
import LogListComponent from '../../../components/LogListComponent/LogListComponent'

const LogBudget = () => {
	const { id } = useParams()
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
