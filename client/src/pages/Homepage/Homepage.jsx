import './Homepage.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import { amountWithDecimals } from '../../utilities/format'
import { formatDate } from '../../utilities/formatDates'
import CardMeter from '../../components/CardMeter/CardMeter'

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

	return (
		<main>
			<h1>Homepage</h1>
			{isLoggedIn() && (
				<section className="summaries">
					<div className="summaries__wrapper">
						<div className="summaries__card summaries__budget-total">
							{budgets.length ? (
								<>
									<h2 className="summaries__card--title">
										Budgets total: <span>{totalAmount()}</span>
									</h2>
									{budgets.map((budget) => (
										<CardMeter
											key={budget._id}
											id={budget.title.toLowerCase().replaceAll(' ', '-')}
											totalValue={parseFloat(totalAmount())}
											name={budget.title}
											currentAmount={budget.currentAmount}
											currency={budget.currency}
										/>
									))}
								</>
							) : (
								<p>
									You don't have any budgets created! Please create your first budget: <Link to="/budgets">Create budget</Link>
								</p>
							)}
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

						<div className="summaries__card">
							<h2 className="summaries__card--title">Budget movements</h2>
							<select
								name="budget__movements"
								id="budget__movements"
							>
								<option value="all-time">All time</option>
								<option value="this-year">This year</option>
								<option value="this-month">This month</option>
								<option value="last-month">Last month</option>
								<option value="today">Today</option>
								<option value="last-day">Last day</option>
								<option value="custom-date">Custom...</option>
							</select>
							<ul className="summaries__card--list">
								{budgets.map((budget) => (
									<li
										className="summaries__card--list-item"
										key={budget._id}
									>
										{`${budget.title} ${
											budget.startAmount !== budget.currentAmount
												? budget.startAmount
													? (((budget.currentAmount - budget.startAmount) / budget.startAmount) * 100).toFixed(2)
													: 100
												: 0
										}%`}
									</li>
								))}
							</ul>
						</div>

						<div className="summaries__card">
							<h2 className="summaries__card--title">Expenses per category</h2>
						</div>
					</div>
				</section>
			)}
		</main>
	)
}

export default Homepage
