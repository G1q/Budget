import './Homepage.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import { amountWithDecimals } from '../../utilities/format'
import { formatDate } from '../../utilities/formatDates'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Homepage = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [budgets, setBudgets] = useState([])
	const [transactions, setTransactions] = useState([])
	const [expenses, setExpenses] = useState([])
	const [expensesCategories, setExpensesCategories] = useState([])
	const [error, setError] = useState(null)

	useEffect(() => {
		getBudgets()
		getTransactions()
	}, [])

	const getBudgets = async () => {
		try {
			const response = await axiosInstance.get(`budgets/${getUserId()}`)
			setBudgets(response.data)
		} catch {
			setError(error.message)
		}
	}

	const getTransactions = async () => {
		try {
			const incomes = await axiosInstance(`incomes/${getUserId()}`)
			const expenses = await axiosInstance(`expenses/${getUserId()}`)

			setExpenses(expenses.data)
			setExpensesCategories([...new Set(expenses.data.map((expense) => expense.category))])
			setTransactions(incomes.data.concat(expenses.data))
		} catch (error) {
			setError(error.message)
		}
	}

	const totalAmount = () => {
		let total = 0
		let currency
		// TODO: separat pe valuta
		for (let i = 0; i < budgets.length; i++) {
			total += budgets[i].currentAmount
			currency = budgets[i].currency
		}
		return amountWithDecimals(total, currency)
	}

	const expensesPerCategory = (category) => {
		let total = 0
		for (let i = 0; i < expenses.length; i++) {
			if (expenses[i].category === category) total += expenses[i].amount
		}
		return amountWithDecimals(total)
	}

	// Chart
	const labels = expensesCategories
	const data = {
		labels,
		datasets: [
			{
				label: 'Total expenses',
				data: labels.map((label) => expensesPerCategory(label)),
				backgroundColor: 'royalblue',
			},
		],
	}

	return (
		<main>
			<h1>Homepage</h1>
			<section className="summaries">
				{error && <p>{error}</p>}
				<div className="summaries__wrapper">
					<div className="summaries__card summaries__budget-total">
						<p>
							Budgets total: <span>{totalAmount()}</span>
						</p>
					</div>

					<div className="summaries__card">
						<table className="summaries__card-table">
							<caption>Last 5 transactions</caption>
							<thead>
								<tr>
									<th>Date</th>
									<th>Amount</th>
									<th>Type</th>
								</tr>
							</thead>
							<tbody>
								{transactions
									.sort((a, b) => new Date(b.date) - new Date(a.date))
									.slice(0, 5)
									.map((transaction, index) => (
										<tr key={transaction._id}>
											<td>{formatDate(new Date(transaction.date))}</td>
											<td>{amountWithDecimals(transaction.amount, transaction.currency)}</td>
											<td>{transaction.source ? 'Income' : 'Expense'}</td>
										</tr>
									))}
							</tbody>
						</table>
						<Link
							to="/transactions"
							className="summaries__card-link"
						>
							View all transactions
						</Link>
					</div>

					{/* <div className="summaries__card">
						<table>
							<thead>
								<tr>
									<th>Category</th>
									<th>Total amount</th>
								</tr>
							</thead>
							<tbody>
								{expensesCategories.map((category) => (
									<tr key={category}>
										<td>{category}</td>
										<td>{expensesPerCategory(category)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div> */}
				</div>
				<div
					className="summaries__card"
					style={{ marginInline: 'auto', marginBlock: '1rem', maxHeight: '300px' }}
				>
					<Bar data={data} />
				</div>
			</section>
		</main>
	)
}

export default Homepage
