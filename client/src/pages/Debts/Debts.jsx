import './Debts.css'
import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import { formatDate } from '../../utilities/formatDates'
import { amountWithDecimals } from '../../utilities/format'

const Debts = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [debts, setDebts] = useState([])
	const [error, setError] = useState(null)

	const getDebts = async () => {
		try {
			const response = await axiosInstance(`debts/${getUserId()}`)
			setDebts(response.data)
		} catch (error) {
			setError(error.message)
		}
	}

	useEffect(() => {
		getDebts()
	}, [])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this debt?')

		if (confirmDelete) {
			try {
				// Delete debt
				await axiosInstance.delete(`debts/${id}`)

				// Refresh debts list
				getDebts()
			} catch (error) {
				setError(error.message)
			}
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Debts</h1>
			<div className="buttons-group">
				<Link
					to="./create"
					className="create-btn"
				>
					Create new debt
				</Link>
			</div>

			{error && <p className="error-msg transaction__error-msg">{error}</p>}
			{debts.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Creditor</th>
							<th>Start amount</th>
							<th>Current amount</th>
							<th>Active</th>
							<th>Edit debt</th>
							<th>Delete debt</th>
						</tr>
					</thead>
					<tbody>
						{debts.map((debt) => (
							<tr key={debt._id}>
								<td>{formatDate(new Date(debt.date))}</td>
								<td>{debt.creditor.title}</td>
								<td>{debt.startAmount > 0 ? `-${amountWithDecimals(debt.startAmount, debt.currency)}` : 0}</td>
								<td>{debt.currentAmount > 0 ? `-${amountWithDecimals(debt.currentAmount, debt.currency)}` : 0}</td>
								<td>{debt.currentAmount > 0 ? 'Yes' : 'No'}</td>
								<td>
									<Link
										className="edit-btn"
										to={`/debts/edit/${debt._id}`}
									>
										Edit
									</Link>
								</td>
								<td>
									<button
										className="delete-btn"
										onClick={() => handleDelete(debt._id)}
									>
										&times;
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>You don't have any debts!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Debts
