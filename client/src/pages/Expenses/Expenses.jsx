import './Expenses.css'
import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import { formatDate } from '../../utilities/formatDates'
import { amountWithDecimals } from '../../utilities/format'

const Expenses = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [expenses, setExpenses] = useState([])
	const [debts, setDebts] = useState([])
	const [error, setError] = useState(null)

	const getExpenses = async () => {
		try {
			const response = await axiosInstance(`expenses/${getUserId()}`)
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

	useEffect(() => {
		getExpenses()
		getDebts()
	}, [])

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

	return isLoggedIn() ? (
		<main>
			<h1>Expenses</h1>
			<div className="buttons-group">
				<Link
					to="./create"
					className="create-btn"
				>
					Create expense
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
