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
	const [debts, setDebts] = useState([])
	const [transactions, setTransactions] = useState([])
	const [expenses, setExpenses] = useState([])
	const [expensesCategories, setExpensesCategories] = useState([])
	const [allExpensesByCategory, setAllExpensesByCategory] = useState([])
	const [expensesSubCategories, setExpensesSubCategories] = useState([])
	const [allExpensesBySubCategory, setAllExpensesBySubCategory] = useState([])
	const [error, setError] = useState(null)
	const [subcategories, setSubcategories] = useState([])
	const [expensePerSelectedproduct, setExpensePerSelectedProduct] = useState(null)

	useEffect(() => {
		getBudgets()
		getTransactions()
		getDebts()
		allExpensesCategory()
		allExpensesSubCategory()
	}, [])

	const getBudgets = async () => {
		try {
			const response = await axiosInstance.get(`budgets/${getUserId()}`)
			setBudgets(response.data)
		} catch {
			setError(error.message)
		}
	}

	const getDebts = async () => {
		try {
			const response = await axiosInstance.get(`debts/${getUserId()}`)
			setDebts(response.data)
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
			setExpensesSubCategories([...new Set(expenses.data.map((expense) => expense.subcategory))])
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

	const expensesPerCategory = (category) => {
		let total = 0
		for (let i = 0; i < expenses.length; i++) {
			if (expenses[i].category === category) total += expenses[i].amount
		}
		return amountWithDecimals(total)
	}

	const expensesPerSubCategory = (subcategory) => {
		let total = 0
		for (let i = 0; i < expenses.length; i++) {
			if (expenses[i].subcategory === subcategory) total += expenses[i].amount
		}
		return amountWithDecimals(total)
	}

	const allExpensesCategory = () => {
		const allExpensesPerCategory = []
		expensesCategories.map((cat) => allExpensesPerCategory.push({ title: cat, amount: expensesPerCategory(cat) }))
		setAllExpensesByCategory(allExpensesPerCategory.sort((a, b) => b.amount - a.amount))
	}

	const allExpensesSubCategory = () => {
		const allExpensesPerSubCategory = []
		expensesSubCategories.map((subcategory) => allExpensesPerSubCategory.push({ title: subcategory, amount: expensesPerSubCategory(subcategory) }))
		setAllExpensesBySubCategory(allExpensesPerSubCategory.sort((a, b) => b.amount - a.amount))
	}

	const getSubCategories = async (currentCategory) => {
		try {
			const response = await axiosInstance.get(`/categories/${getUserId()}`)
			setSubcategories([...new Set(response.data.filter((cat) => cat.title === currentCategory).map((cat) => cat.subcategory))])
		} catch (error) {
			console.log(error)
		}
	}

	const handleSelectChange = (e) => {
		setExpensePerSelectedProduct(expensesPerSubCategory(e.target.value))
	}

	return (
		<main>
			<h1>Homepage</h1>
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
							<h2 className="summaries__card--title">Expenses per category (first 5)</h2>
							<ul className="summaries__card--list">
								{allExpensesByCategory.slice(0, 5).map((cat) => (
									<li
										className="summaries__card--list-item"
										key={cat.title}
									>
										{cat.title} - {cat.amount}
									</li>
								))}
							</ul>
						</div>

						<div className="summaries__card">
							<h2 className="summaries__card--title">Expenses per subcategory (first 5)</h2>
							<ul className="summaries__card--list">
								{allExpensesBySubCategory.slice(0, 5).map((subcategory) => (
									<li
										className="summaries__card--list-item"
										key={subcategory.title}
									>
										{subcategory.title} - {subcategory.amount}
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>
			)}

			<section>
				<h2>Tools</h2>
				<div className="tool__card">
					<h3>Get amount expense per product</h3>
					<div className="select__group">
						<label htmlFor="select__group--category">Category</label>
						{expensesCategories.length > 0 ? (
							<select
								name="select__group--category"
								id="select__group--category"
								onChange={(e) => {
									getSubCategories(e.target.value)
								}}
								required
							>
								<option
									value=""
									hidden
								>
									Select category..
								</option>
								{expensesCategories.sort().map((category) => (
									<option
										key={category}
										value={category}
									>
										{category}
									</option>
								))}
							</select>
						) : (
							<Link to="/user/categories/">Create your first category!</Link>
						)}
					</div>

					{subcategories.length > 0 ? (
						<div className="select__group">
							<label htmlFor="select__group--subcategory">Subcategory</label>
							<select
								name="select__group--subcategory"
								id="select__group--subcategory"
								onChange={handleSelectChange}
							>
								<option
									value=""
									hidden
								>
									Select subcategory..
								</option>
								{subcategories.sort().map((subcategory) => (
									<option
										key={subcategory}
										value={subcategory}
									>
										{subcategory}
									</option>
								))}
							</select>
						</div>
					) : (
						''
					)}
					<p>{expensePerSelectedproduct}</p>
				</div>
			</section>
		</main>
	)
}

export default Homepage
