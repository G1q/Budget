/* eslint-disable react-hooks/exhaustive-deps */
// Import dependencies
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

// Import custom components
import CardMeter from '../../components/CardMeter/CardMeter'
import SelectInterval from '../../components/SelectInterval/SelectInterval'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import DataTable from '../../components/DataTable/DataTable'

// Import utilities
import { fetchBudgets, fetchCategories, fetchDebts, fetchExpenses, fetchIncomes } from '../../utilities/fetchData'
import { getDatesFromLastmonth, handleSelectIntervalChange } from '../../utilities/handleFunctions'
import { getTotal, sumPerCategory } from '../../utilities/totals'

// Import styling
import './Homepage.css'

const Homepage = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [budgets, setBudgets] = useState([])
	const [expenses, setExpenses] = useState([])
	const [incomes, setIncomes] = useState([])
	const [debts, setDebts] = useState([])
	const [error, setError] = useState(null)
	const [dateInterval, setDateInterval] = useState({ startDate: '1970-01-01', endDate: new Date() })
	const [showCustom, setShowCustom] = useState(false)

	const [currentMonthExpenses, setCurrentMonthExpenses] = useState([])
	const [lastMonthExpenses, setLastMonthExpenses] = useState([])
	const [categories, setCategories] = useState([])

	const lastMonthDate = getDatesFromLastmonth()

	useEffect(() => {
		const today = new Date()
		console.log(lastMonthDate)

		if (isLoggedIn()) {
			fetchBudgets(getUserId())
				.then((responseData) => setBudgets(responseData))
				.catch((error) => setError(error.response.data.message))

			fetchDebts(getUserId())
				.then((responseData) => setDebts(responseData))
				.catch((error) => setError(error.response.data.message))

			fetchExpenses(getUserId(), dateInterval)
				.then((responseData) => setExpenses(responseData))
				.catch((error) => setError(error.response.data.message))

			fetchExpenses(getUserId(), { startDate: today.setDate(0), endDate: new Date() })
				.then((responseData) => setCurrentMonthExpenses(responseData))
				.catch((error) => setError(error.response.data.message))

			fetchExpenses(getUserId(), {
				startDate: lastMonthDate.startDay,
				endDate: lastMonthDate.endDay,
			})
				.then((responseData) => setLastMonthExpenses(responseData))
				.catch((error) => setError(error.response.data.message))

			fetchIncomes(getUserId(), dateInterval)
				.then((responseData) => setIncomes(responseData))
				.catch((error) => setError(error.response.data.message))

			fetchCategories(getUserId())
				.then((responseData) => setCategories(responseData))
				.catch((error) => setError(error.response.data.message))
		}
	}, [dateInterval])

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
				<>
					<section className="summaries">
						<div className="summaries__wrapper">
							<div className="summaries__card">
								{budgets.length ? (
									<>
										<h2 className="summaries__card--title">
											Budgets total: <span>{getTotal(budgets)}</span>
										</h2>
										{budgets.map((budget) => (
											<CardMeter
												key={budget._id}
												id={budget.title.toLowerCase().replaceAll(' ', '-')}
												totalValue={parseFloat(getTotal(budgets))}
												name={budget.title}
												currentAmount={budget.currentAmount}
												currency={budget.currency}
											/>
										))}
									</>
								) : (
									<p>
										You do not have any budgets created! Please create your first budget: <Link to="/budgets">Create budget</Link>
									</p>
								)}
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
									Total expenses: <span>{getTotal(expenses)}</span>
								</p>
								<p
									className="summaries__card--info"
									style={{ '--text-clr': 'forestgreen' }}
								>
									Total incomes: <span>{getTotal(incomes)}</span>
								</p>
							</div>
							<div className="summaries__card">
								{parseFloat(getTotal(debts)) ? (
									<h2 className="summaries__card--title">
										Debts total: <span>{getTotal(debts)}</span>
									</h2>
								) : (
									<p>
										You do not have any active debts! Please create your first debt: <Link to="/debts">Create debt</Link>
									</p>
								)}
							</div>
						</div>

						<div
							className="summaries__card"
							style={{ marginBlock: '1rem', overflowX: 'auto' }}
						>
							<h2 className="summaries__card--title">Expenses per category</h2>
							<DataTable
								size="small"
								cols={['Category', 'This month', 'Last month', 'Diff.']}
							>
								{sumPerCategory(currentMonthExpenses, categories.sort(), lastMonthExpenses).map((category) => (
									<tr key={category.title}>
										<td>{category.title}</td>
										<td>
											<p style={{ margin: 0, padding: '.25rem', fontWeight: 500 }}>
												{category.total}
												<span> {category.total > 0 && `(${((category.total * 100) / parseFloat(getTotal(currentMonthExpenses))).toFixed(2)}%)`}</span>
											</p>
										</td>
										<td>
											<p style={{ margin: 0, padding: '.25rem', fontWeight: 500 }}>
												{category.last}
												<span>
													{category.last > 0 && `(${((category.last * 100) / parseFloat(getTotal(lastMonthExpenses))).toFixed(2)}%)`}
												</span>
											</p>
										</td>
										<td style={{ fontWeight: 500, color: category.total - category.last > 0 ? 'red' : 'green' }}>
											{(category.total - category.last).toFixed(2)}{' '}
											{category.last !== 0
												? `(${100 - (category.total * 100) / category.last < 0 ? '+' : '-'}
											${Math.abs((100 - (category.total * 100) / category.last).toFixed(2))}%)`
												: `(+100%)`}
										</td>
									</tr>
								))}
							</DataTable>
						</div>
					</section>
				</>
			)}
		</main>
	)
}

export default Homepage
