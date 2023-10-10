// Import dependencies
import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// Import custom components
import SelectInterval from '../../components/SelectInterval/SelectInterval'
import ButtonLink from '../../components/ButtonLink/ButtonLink'
import DeleteButton from '../../components/DeleteButton/DeleteButton'
import EditButton from '../../components/EditButton/EditButton'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import DataTable from '../../components/DataTable/DataTable'

// Import utilities
import axiosInstance from '../../utilities/axiosconfig'
import { amountWithDecimals, formatDate } from '../../utilities/format'
import { handleSelectIntervalChange } from '../../utilities/handleFunctions'
import { fetchTransfers } from '../../utilities/fetchData'

// Import styling
import './Transfers.css'

const Transfers = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [transfers, setTransfers] = useState([])
	const [dateInterval, setDateInterval] = useState({ startDate: '1970-01-01', endDate: new Date() })
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)

	useEffect(() => {
		fetchTransfers(getUserId(), dateInterval)
			.then((responseData) => setTransfers(responseData))
			.catch((error) => setError(error.response.data.message))
	}, [dateInterval])

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

				// Create log deleted transfer - source budget
				const deletedSourceLogs = sourceBudget.data.logs

				deletedSourceLogs.push({
					date: Date.now(),
					type: 'deleted-transfer-source',
					currentAmount: newSourceAmount,
					modifiedAmount: Number(transfer.data.amount),
				})

				// Create log deleted transfer - destination budget
				const deletedDestinationLogs = destinationBudget.data.logs

				deletedDestinationLogs.push({
					date: Date.now(),
					type: 'deleted-transfer-destination',
					currentAmount: newDestinationAmount,
					modifiedAmount: Number(transfer.data.amount),
				})

				await axiosInstance.put(`budgets/${transfer.data.sourceId}`, { currentAmount: newSourceAmount, logs: deletedSourceLogs })
				await axiosInstance.put(`budgets/${transfer.data.budgetId}`, { currentAmount: newDestinationAmount, logs: deletedDestinationLogs })

				// Delete income
				const response = await axiosInstance.delete(`transfers/${id}`)

				setError(null)
				setSuccess(response.data.message)

				// Refresh incomes list
				fetchTransfers(getUserId(), dateInterval)
					.then((responseData) => setTransfers(responseData))
					.catch((error) => setError(error.response.data.message))
			} catch (error) {
				setSuccess(null)
				error.response ? setError(error.response.data.message) : setError(error.message)
			}
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Transfers</h1>

			<div className="header__actions">
				<div className="buttons-group">
					<ButtonLink to="./create">Create transfer</ButtonLink>
				</div>

				<SelectInterval
					onChange={(e) => setDateInterval(handleSelectIntervalChange(e))}
					label="Select date"
				/>
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

			{transfers.length > 0 ? (
				<DataTable cols={['Date', 'Source', 'Budget', 'Amount', 'Edit transfer', 'Delete transfer']}>
					{transfers.map((transfer) => (
						<tr key={transfer._id}>
							<td>{formatDate(new Date(transfer.date))}</td>
							<td>{transfer.sourceTitle}</td>
							<td>{transfer.budgetTitle}</td>
							<td>{amountWithDecimals(transfer.amount, transfer.currency)}</td>
							<td>
								<EditButton state={{ id: transfer._id }} />
							</td>
							<td>
								<DeleteButton onClick={() => handleDelete(transfer._id)} />
							</td>
						</tr>
					))}
				</DataTable>
			) : (
				<p>You don't have any transfers!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Transfers
