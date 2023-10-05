// Import dependencies
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

// Import custom components
import CardMeter from '../../components/CardMeter/CardMeter'
import SelectInterval from '../../components/SelectInterval/SelectInterval'
import StatusMessage from '../../components/StatusMessage/StatusMessage'

// Import utilities
import { amountWithDecimals, formatDate } from '../../utilities/format'
import { fetchBudgets, fetchDebts, fetchExpenses, fetchIncomes, fetchTransactions } from '../../utilities/fetchData'
import { handleSelectIntervalChange } from '../../utilities/handleFunctions'

// Import styling
import './Homepage.css'

const Homepage = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [budgets, setBudgets] = useState([])
	const [transactions, setTransactions] = useState([])
	const [expenses, setExpenses] = useState([])
	const [incomes, setIncomes] = useState([])
	const [debts, setDebts] = useState([])
	const [error, setError] = useState(null)
	const [dateInterval, setDateInterval] = useState({ startDate: '1970-01-01', endDate: new Date() })
	const [showCustom, setShowCustom] = useState(false)

	const transactionsParams = { startDate: '1970-01-01', endDate: new Date() }

	useEffect(() => {
		fetchBudgets(getUserId())
			.then((responseData) => setBudgets(responseData))
			.catch((error) => setError(error.response.data.message))

		fetchDebts(getUserId())
			.then((responseData) => setDebts(responseData))
			.catch((error) => setError(error.response.data.message))

		fetchTransactions(getUserId(), transactionsParams)
			.then((responseData) => setTransactions(responseData))
			.catch((error) => setError(error.response.data.message))

		fetchExpenses(getUserId(), dateInterval)
			.then((responseData) => setExpenses(responseData))
			.catch((error) => setError(error.response.data.message))

		fetchIncomes(getUserId(), dateInterval)
			.then((responseData) => setIncomes(responseData))
			.catch((error) => setError(error.response.data.message))
	}, [dateInterval])

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

	const totalDebts = () => {
		let total = 0
		let currency
		// TODO: separat pe valuta
		for (let i = 0; i < debts.length; i++) {
			total += debts[i].currentAmount
			currency = debts[i].currency
		}
		return amountWithDecimals(total, currency)
	}

	const totalExpenses = () => {
		let total = 0
		let currency
		for (let i = 0; i < expenses.length; i++) {
			total += expenses[i].amount
			currency = expenses[i].currency
		}
		return amountWithDecimals(total, currency)
	}

	const totalIncomes = () => {
		let total = 0
		let currency
		for (let i = 0; i < incomes.length; i++) {
			total += incomes[i].amount
			currency = incomes[i].currency
		}
		return amountWithDecimals(total, currency)
	}

	return (
		<main>
			<h1>Homepage</h1>
			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}
			{isLoggedIn() && (
				<section className="summaries">
					<div className="summaries__wrapper">
						<div className="summaries__card">
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
							{debts.length ? (
								<h2 className="summaries__card--title">
									Debts total: <span>{totalDebts()}</span>
								</h2>
							) : (
								<p>
									You don't have any debts! Please create your first debt: <Link to="/debts">Create debt</Link>
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
										.map((transaction) => (
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
							<SelectInterval
								onChange={(e) => {
									setDateInterval(handleSelectIntervalChange(e))
									e.target.value === 'custom' ? setShowCustom(true) : setShowCustom(false)
								}}
								label="Select date"
								showCustom={showCustom}
							/>
							<p
								className="summaries__card--info"
								style={{ '--text-clr': 'crimson' }}
							>
								Total expenses: <span>{totalExpenses()}</span>
							</p>
							<p
								className="summaries__card--info"
								style={{ '--text-clr': 'forestgreen' }}
							>
								Total incomes: <span>{totalIncomes()}</span>
							</p>
						</div>
					</div>
				</section>
			)}
		</main>
	)
}

export default Homepage
