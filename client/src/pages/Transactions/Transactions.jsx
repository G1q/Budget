import './Transactions.css'
import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import { formatDate } from '../../utilities/formatDates'

const Transactions = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [transactions, setTransactions] = useState([])
	const [error, setError] = useState(null)

	const getTransactions = async () => {
		try {
			const incomes = await axiosInstance(`incomes/${getUserId()}`)
			const expenses = await axiosInstance(`expenses/${getUserId()}`)

			setTransactions(incomes.data.concat(expenses.data))
		} catch (error) {
			setError(error.message)
		}
	}

	useEffect(() => {
		getTransactions()
	}, [])

	return isLoggedIn() ? (
		<main>
			<h1>Transactions</h1>
			<div className="buttons-group">
				<Link
					to="./create"
					className="create-btn"
				>
					Create transaction
				</Link>
			</div>

			{error && <p className="error-msg transaction__error-msg">{error}</p>}
			{transactions.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Budget</th>
							<th>Amount</th>
							<th>Type</th>
						</tr>
					</thead>
					<tbody>
						{transactions
							.sort((a, b) => new Date(b.date) - new Date(a.date))
							.map((transaction) => (
								<tr
									key={transaction._id}
									data-type={transaction.source ? 'income' : 'expense'}
								>
									<td>{formatDate(new Date(transaction.date))}</td>
									<td>{transaction.budget.title}</td>
									<td>{transaction.amount}</td>
									<td>{transaction.source ? 'Income' : 'Expense'}</td>
								</tr>
							))}
					</tbody>
				</table>
			) : (
				<p>You don't have any transactions!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Transactions
