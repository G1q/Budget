// Import dependencies
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// Import custom components
import SelectInterval from '../../components/SelectInterval/SelectInterval'
import Button from '../../components/Button/Button'
import ButtonLink from '../../components/ButtonLink/ButtonLink'
import DeleteButton from '../../components/DeleteButton/DeleteButton'
import EditButton from '../../components/EditButton/EditButton'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import DataTable from '../../components/DataTable/DataTable'
import Dialog, { openDialog, closeDialog } from '../../components/Dialog/Dialog'

// Import utilities
import axiosInstance from '../../utilities/axiosconfig'
import { amountWithDecimals, formatDate } from '../../utilities/format'
import { handleSelectIntervalChange } from '../../utilities/handleFunctions'
import { fetchIncomes } from '../../utilities/fetchData'

// Import styling
import './Incomes.css'

const Incomes = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [incomes, setIncomes] = useState([])
	const [inputs, setInputs] = useState('')
	const [dateInterval, setDateInterval] = useState({ startDate: '1970-01-01', endDate: new Date() })
	const [query, setQuery] = useState('')
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)

	useEffect(() => {
		fetchIncomes(getUserId(), dateInterval)
			.then((responseData) => setIncomes(responseData))
			.catch((error) => setError(error.response.data.message))
	}, [dateInterval, query])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this income? The source budget will debit with income amount.')

		if (confirmDelete) {
			try {
				const income = await axiosInstance.get(`incomes/view/${id}`)
				const budgetId = income.data.budget
				const amount = income.data.amount

				// Change budget to initial amount
				const budget = await axiosInstance.get(`budgets/view/${budgetId}`)
				const newAmount = Number(budget.data.currentAmount) - Number(amount)

				if (newAmount < 0) throw new Error('Budget will decrease under 0. Please check again!')

				// Create budget log for deleted income
				const logs = budget.data.logs

				logs.push({
					date: Date.now(),
					type: 'deleted-income',
					currentAmount: newAmount,
					modifiedAmount: Number(amount),
				})

				await axiosInstance.put(`budgets/${budgetId}`, { currentAmount: newAmount, logs: logs })

				// Delete income
				try {
					const response = await axiosInstance.delete(`incomes/${id}`)
					setError(null)
					setSuccess(response.data.message)
				} catch (error) {
					setSuccess(null)
					error.response ? setError(error.response.data.message) : setError(error.message)
				}

				// Refresh incomes list
				fetchIncomes(getUserId(), dateInterval)
					.then((responseData) => setIncomes(responseData))
					.catch((error) => setError(error.response.data.message))
			} catch (error) {
				setSuccess(null)
				error.response ? setError(error.response.data.message) : setError(error.message)
			}
		}
	}

	const handleCreateSource = async (e) => {
		e.preventDefault()
		try {
			const response = await axiosInstance.post('incomes/source', { title: inputs, user: getUserId() })
			closeDialog()
			setError(null)
			setSuccess(response.data.message)
		} catch (error) {
			setSuccess(null)
			error.response ? setError(error.response.data.message) : setError(error.message)
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Incomes</h1>
			<div className="header__actions">
				<div className="buttons-group">
					<ButtonLink to="./create">Create income</ButtonLink>

					<Button
						onClick={openDialog}
						className="popup-btn"
					>
						Create new source
					</Button>
				</div>

				<SelectInterval
					onChange={(e) => setDateInterval(handleSelectIntervalChange(e))}
					label="Select date"
				/>
			</div>

			<div className="filter__wrapper">
				<input
					type="search"
					name=""
					id=""
					placeholder="Search terms"
					onChange={(e) => setQuery(e.target.value.toLowerCase())}
				/>
			</div>

			<Dialog
				title="Create new source"
				textButton="Create source"
				onClick={closeDialog}
				onSubmit={handleCreateSource}
			>
				<label htmlFor="title">Title</label>
				<input
					type="text"
					name="title"
					id="title"
					onChange={(e) => setInputs(e.target.value)}
				/>
				{error && (
					<StatusMessage
						type="error"
						message={error}
					/>
				)}
			</Dialog>

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
			{incomes.length > 0 ? (
				<DataTable cols={['Date', 'Source', 'Budget', 'Amount', 'Edit income', 'Delete income']}>
					{incomes
						.filter((income) => String(income.amount).concat(income.source.title, income.budget.title).toLowerCase().includes(query))
						.map((income) => (
							<tr key={income._id}>
								<td>{formatDate(new Date(income.date))}</td>
								<td>{income.source.title}</td>
								<td>{income.budget.title}</td>
								<td>{amountWithDecimals(income.amount, income.currency)}</td>
								<td>
									<EditButton to={`/incomes/edit/${income._id}`} />
								</td>
								<td>
									<DeleteButton onClick={() => handleDelete(income._id)} />
								</td>
							</tr>
						))}
				</DataTable>
			) : (
				<p>You don't have any incomes!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Incomes
