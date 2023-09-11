import './Transfers.css'
import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import { formatDate } from '../../utilities/formatDates'

const Transfers = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [transfers, setTransfers] = useState([])
	const [error, setError] = useState(null)

	const getTransfers = async () => {
		try {
			const response = await axiosInstance.get(`transfers/${getUserId()}`)
			setTransfers(response.data)
			setError(null)
		} catch (error) {
			setError(error.message)
		}
	}

	useEffect(() => {
		getTransfers()
	}, [])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this transfer? All amounts will be reverted to original budgets')

		if (confirmDelete) {
			try {
				const transfer = await axiosInstance.get(`/transfers/view/${id}`)
				const sourceBudget = await axiosInstance.get(`/budgets/view/${transfer.data.sourceId}`)
				const destinationBudget = await axiosInstance.get(`/budgets/view/${transfer.data.budgetId}`)

				// Change budget to initial amount
				const newSourceAmount = Number(sourceBudget.data.currentAmount) + Number(transfer.data.amount)
				const newDestinationAmount = Number(destinationBudget.data.currentAmount) - Number(transfer.data.amount)

				await axiosInstance.put(`budgets/${transfer.data.sourceId}`, { currentAmount: newSourceAmount })
				await axiosInstance.put(`budgets/${transfer.data.budgetId}`, { currentAmount: newDestinationAmount })

				// Delete income
				await axiosInstance.delete(`transfers/${id}`)

				// Refresh incomes list
				getTransfers()
			} catch (error) {
				setError(error.message)
			}
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Transfers</h1>
			<div className="buttons-group">
				<Link
					to="./create"
					className="create-btn"
				>
					Create transfer
				</Link>
			</div>

			{error && <p className="error-msg transaction__error-msg">{error}</p>}
			{transfers.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Source</th>
							<th>Budget</th>
							<th>Amount</th>
							<th>Edit transfer</th>
							<th>Delete transfer</th>
						</tr>
					</thead>
					<tbody>
						{transfers.map((transfer) => (
							<tr key={transfer._id}>
								<td>{formatDate(new Date(transfer.date))}</td>
								<td>{transfer.sourceTitle}</td>
								<td>{transfer.budgetTitle}</td>
								<td>{transfer.amount}</td>
								<td>
									<Link
										className="edit-btn"
										to={`/transfers/edit/${transfer._id}`}
									>
										Edit
									</Link>
								</td>
								<td>
									<button
										className="delete-btn"
										onClick={() => handleDelete(transfer._id)}
									>
										&times;
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>You don't have any transfers!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Transfers
