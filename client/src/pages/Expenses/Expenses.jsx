import './Expenses.css'
import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import { formatDate } from '../../utilities/formatDates'

const Expenses = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [expenses, setExpenses] = useState([])

	const getExpenses = async () => {
		try {
			const response = await axiosInstance(`expenses/${getUserId()}`)
			setExpenses(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getExpenses()
	}, [])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this expense?')

		if (confirmDelete) {
			try {
				const response = await axiosInstance.delete(`expenses/${id}`)
				getExpenses()
			} catch (error) {
				console.log(error)
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
			</div>

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
								<td>{expense.amount}</td>
								<td>{expense.category}</td>
								<td>{expense.subcategory}</td>
								<td>
									<Link
										className="edit-btn"
										to={`/expenses/edit/${expense._id}`}
									>
										Edit
									</Link>
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
