// Import dependencies
import { Navigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// Import custom elements
import TdMeter from '../../components/TdMeter/TdMeter'
import ButtonLink from '../../components/ButtonLink/ButtonLink'
import DataTable from '../../components/DataTable/DataTable'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import EditButton from '../../components/EditButton/EditButton'
import DeleteButton from '../../components/DeleteButton/DeleteButton'
import LogButton from '../../components/LogButton/LogButton'

// Import utilities
import { amountWithDecimals } from '../../utilities/format'
import axiosInstance from '../../utilities/axiosconfig'
import { fetchBudgets } from '../../utilities/fetchData'

const Budgets = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [budgets, setBudgets] = useState([])
	const [error, setError] = useState(null)
	const [success, setSucces] = useState(null)

	useEffect(() => {
		fetchBudgets(getUserId())
			.then((responseData) => setBudgets(responseData))
			.catch((error) => setError(error.response.data.message))
	}, [])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this budget?')

		if (confirmDelete) {
			try {
				const response = await axiosInstance.delete(`budgets/${id}`)
				setError(null)
				setSucces(response.data.message)
				fetchBudgets(getUserId())
					.then((responseData) => setBudgets(responseData))
					.catch((error) => setError(error.response.data.message))
			} catch (error) {
				error.response ? setError(error.response.data.message) : setError(error.message)
			}
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Budgets</h1>

			<div className="buttons-group">
				<ButtonLink to="./create">Create budget</ButtonLink>
				<ButtonLink to="/user/transfers/create">Transfer between budgets</ButtonLink>
			</div>
			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}
			{success && (
				<StatusMessage
					type="success"
					message={success}
				/>
			)}
			{budgets.length > 0 ? (
				<DataTable cols={['Title', 'Start amount', 'Current amount', 'Target amount', 'Logs', 'Edit', 'Delete']}>
					{budgets.map((budget) => (
						<tr key={budget._id}>
							<td>{budget.title}</td>
							<td>{amountWithDecimals(budget.startAmount, budget.currency)}</td>
							<td>{amountWithDecimals(budget.currentAmount, budget.currency)}</td>
							<TdMeter
								amount={budget.currentAmount}
								target={budget.targetAmount}
								currency={budget.currency}
							/>
							<td>
								<LogButton state={{ id: budget._id }} />
							</td>
							<td>
								<EditButton state={{ id: budget._id }} />
							</td>
							<td>
								<DeleteButton onClick={() => handleDelete(budget._id)} />
							</td>
						</tr>
					))}
				</DataTable>
			) : (
				<p>Please create your first budget to start!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Budgets
