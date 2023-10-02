import './Expenses.css'
import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import { formatDate } from '../../utilities/formatDates'
import { amountWithDecimals } from '../../utilities/format'
import SelectInterval from '../../components/SelectInterval/SelectInterval'

const Expenses = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [expenses, setExpenses] = useState([])
	const [debts, setDebts] = useState([])
	const [error, setError] = useState(null)
	const [dateInterval, setDateInterval] = useState({ startDate: '1970-01-01', endDate: new Date() })

	useEffect(() => {
		getExpenses()
		getDebts()
	}, [dateInterval])

	const getExpenses = async () => {
		try {
			const response = await axiosInstance.get(`expenses/${getUserId()}`, {
				params: { startDate: dateInterval.startDate, endDate: dateInterval.endDate },
			})
			setExpenses(response.data)
		} catch (error) {
			setError(error.message)
		}
	}

	const getDebts = async () => {
		try {
			const response = await axiosInstance.get(`/debts/${getUserId()}`)
			setDebts(response.data)
		} catch (error) {
			setError(error.message)
		}
	}

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this expense? The source budget will credit with expense amount.')

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
				getExpenses()
			} catch (error) {
				setError(error.message)
			}
		}
	}

	const handleSelectIntervalChange = (e) => {
		const getLastDayOfMonth = (date) => {
			const nextMonthFirstDay = new Date(date.getFullYear(), date.getMonth(), 1)
			const lastDayOfMonth = new Date(nextMonthFirstDay - 1)
			return lastDayOfMonth
		}

		let startDate = new Date()
		startDate.setHours(0, 0, 0, 0)
		let endDate = new Date()
		endDate.setHours(23, 59, 59, 0)
		switch (e.target.value) {
			case 'all-time':
				startDate = new Date('1970-01-01')
				break
			case 'this-year':
				startDate.setDate(1)
				startDate.setMonth(0)
				break
			case 'this-month':
				startDate.setDate(1)
				break
			case 'last-month':
				startDate.setMonth(startDate.getMonth() - 1)
				startDate.setDate(1)
				endDate = getLastDayOfMonth(endDate)
				break
			case 'today':
				break
			case 'yesterday':
				startDate.setDate(startDate.getDate() - 1)
				endDate.setDate(endDate.getDate() - 1)
				break
			case 'custom':
				startDate = new Date('1970-01-01')
				endDate = new Date()
				break
			default:
				startDate = new Date('1970-01-01')
				endDate = new Date()
		}

		setDateInterval({
			startDate,
			endDate,
		})
	}

	return isLoggedIn() ? (
		<main>
			<h1>Expenses</h1>
			<div className="header__actions">
				<div className="buttons-group">
					<Link
						to="./create"
						className="create-btn"
					>
						Create expense
					</Link>

					<Link
						to="/user/categories"
						className="create-btn"
					>
						Create new category
					</Link>

					{debts.length > 0 && (
						<Link
							to="./paydebt"
							className="create-btn"
						>
							Pay debt
						</Link>
					)}
				</div>

				<SelectInterval onChange={handleSelectIntervalChange} />
			</div>

			{error && <p className="error-msg transaction__error-msg">{error}</p>}
			{expenses.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Budget</th>
							<th>Amount</th>
							<th>Category</th>
							<th>Subcategory</th>
							<th>Edit expense</th>
							<th>Delete expense</th>
						</tr>
					</thead>
					<tbody>
						{expenses.map((expense) => (
							<tr key={expense._id}>
								<td>{formatDate(new Date(expense.date))}</td>
								<td>{expense.budget.title}</td>
								<td>{amountWithDecimals(expense.amount, expense.currency)}</td>
								<td>{expense.category}</td>
								<td>{expense.subcategory}</td>
								<td>
									{expense.category !== 'Debt' ? (
										<Link
											className="edit-btn"
											to={`/expenses/edit/${expense._id}`}
										>
											Edit
										</Link>
									) : (
										'-'
									)}
								</td>
								<td>
									<button
										className="delete-btn"
										onClick={() => handleDelete(expense._id)}
									>
										&times;
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>You don't have any expenses!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Expenses
