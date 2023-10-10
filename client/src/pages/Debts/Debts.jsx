// Import dependencies
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

// Import custom components
import ButtonLink from '../../components/ButtonLink/ButtonLink'
import StatusMessage from '../../components/StatusMessage/StatusMessage'

// Import utilities
import { amountWithDecimals, formatDate } from '../../utilities/format'
import axiosInstance from '../../utilities/axiosconfig'
import { fetchDebts } from '../../utilities/fetchData'

// Import styling
import './Debts.css'
import EditButton from '../../components/EditButton/EditButton'
import DeleteButton from '../../components/DeleteButton/DeleteButton'
import DataTable from '../../components/DataTable/DataTable'

const Debts = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [debts, setDebts] = useState([])
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)
	const [activeDebts, setActiveDebts] = useState(true)

	useEffect(() => {
		fetchDebts(getUserId())
			.then((responseData) => setDebts(responseData))
			.catch((error) => setError(error.response.data.message))
	}, [activeDebts])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure you want to delete this debt?')

		if (confirmDelete) {
			try {
				// Delete debt
				const response = await axiosInstance.delete(`debts/${id}`)
				setError(null)
				setSuccess(response.data.message)

				// Refresh debts list
				fetchDebts(getUserId())
					.then((responseData) => setDebts(responseData))
					.catch((error) => setError(error.response.data.message))
			} catch (error) {
				setSuccess(null)
				error.response ? setError(error.response.data.message) : setError(error.message)
			}
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Debts</h1>
			<div className="header__actions">
				<div className="buttons-group">
					<ButtonLink to="./create">Create new debt</ButtonLink>
				</div>

				{debts.length > 0 && (
					<div className="buttons-group__checkbox">
						<label htmlFor="activeDebts">View inactive debts</label>
						<input
							type="checkbox"
							name="activeDebts"
							id="activeDebts"
							onChange={() => setActiveDebts(!activeDebts)}
						/>
					</div>
				)}
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
			{debts.length > 0 ? (
				<DataTable cols={['Date', 'Creditor', 'Start amount', 'Current amount', 'Active', 'Edit debt', 'Delete debt']}>
					{debts
						.filter((debt) => (activeDebts ? debt.currentAmount > 0 : debt))
						.map((debt) => (
							<tr key={debt._id}>
								<td>{formatDate(new Date(debt.date))}</td>
								<td>{debt.creditor.title}</td>
								<td>{debt.startAmount > 0 ? `-${amountWithDecimals(debt.startAmount, debt.currency)}` : 0}</td>
								<td>{debt.currentAmount > 0 ? `-${amountWithDecimals(debt.currentAmount, debt.currency)}` : 0}</td>
								<td>{debt.currentAmount > 0 ? 'Yes' : 'No'}</td>
								<td>
									<EditButton state={{ id: debt._id }} />
								</td>
								<td>
									<DeleteButton onClick={() => handleDelete(debt._id)} />
								</td>
							</tr>
						))}
				</DataTable>
			) : (
				<p>You don't have any debts!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Debts
