// Import dependencies
import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// Import custom components
import SelectInterval from '../../components/SelectInterval/SelectInterval'
import ButtonLink from '../../components/ButtonLink/ButtonLink'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import DataTable from '../../components/DataTable/DataTable'
import EditButton from '../../components/EditButton/EditButton'
import DeleteButton from '../../components/DeleteButton/DeleteButton'

// Import utilities
import axiosInstance from '../../utilities/axiosconfig'
import { amountWithDecimals, formatDate } from '../../utilities/format'
import { handleSelectIntervalChange } from '../../utilities/handleFunctions'
import { fetchDebts, fetchExpenses, fetchIncomes } from '../../utilities/fetchData'

// Import styling
import './Expenses.css'

const Expenses = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [expenses, setExpenses] = useState([])
	const [debts, setDebts] = useState([])
	const [dateInterval, setDateInterval] = useState({ startDate: '1970-01-01', endDate: new Date() })
	const [error, setError] = useState(null)

	useEffect(() => {
		fetchExpenses(getUserId(), dateInterval)
			.then((responseData) => setExpenses(responseData))
			.catch((error) => setError(error.response.data.message))
		fetchDebts(getUserId())
			.then((responseData) => setDebts(responseData))
			.catch((error) => setError(error.response.data.message))
	}, [dateInterval])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure you want to delete this expense? The source budget will credit with expense amount.')

		if (confirmDelete) {
			try {
				const expense = await axiosInstance.get(`expenses/view/${id}`)
				const budgetId = expense.data.budget
				const amount = expense.data.amount

				// Change budget to initial amount
				const budget = await axiosInstance.get(`budgets/view/${budgetId}`)
				await axiosInstance.put(`budgets/${budgetId}`, { currentAmount: Number(budget.data.currentAmount) + Number(amount) })

				// Delete expense
				await axiosInstance.delete(`expenses/${id}`)

				// Refresh expenses list
				fetchExpenses(getUserId(), dateInterval)
					.then((responseData) => setExpenses(responseData))
					.catch((error) => setError(error.response.data.message))
			} catch (error) {
				setError(error.response.data.message)
			}
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Expenses</h1>
			<div className="header__actions">
				<div className="buttons-group">
					<ButtonLink to="./create">Create expense</ButtonLink>
					<ButtonLink to="/user/categories">Create new category</ButtonLink>
					{debts.length > 0 && <ButtonLink>Pay debt (disabled)</ButtonLink>} {/* to="./paydebt" */}
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
			{expenses.length > 0 ? (
				<DataTable cols={['Date', 'Budget', 'Amount', 'Category', 'Subcategory', 'Edit expense', 'Delete expense']}>
					{expenses.map((expense) => (
						<tr key={expense._id}>
							<td>{formatDate(new Date(expense.date))}</td>
							<td>{expense.budget.title}</td>
							<td>{amountWithDecimals(expense.amount, expense.currency)}</td>
							<td>{expense.category}</td>
							<td>{expense.subcategory}</td>
							<td>
								<EditButton to={`/expenses/edit/${expense._id}`} />
							</td>
							<td>
								<DeleteButton onClick={() => handleDelete(expense._id)} />
							</td>
						</tr>
					))}
				</DataTable>
			) : (
				<p>You don't have any expenses!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Expenses
