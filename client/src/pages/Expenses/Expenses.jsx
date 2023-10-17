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
import Pagination from '../../components/Pagination/Pagination'

// Import utilities
import axiosInstance from '../../utilities/axiosconfig'
import { amountWithDecimals, formatDate } from '../../utilities/format'
import { handleSelectIntervalChange } from '../../utilities/handleFunctions'
import { fetchDebts, fetchExpenses, fetchIncomes } from '../../utilities/fetchData'
import { getTotal } from '../../utilities/totals'

const ITEMS_PER_PAGE = 20

const Expenses = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [expenses, setExpenses] = useState([])
	const [debts, setDebts] = useState([])
	const [dateInterval, setDateInterval] = useState({ startDate: '1970-01-01', endDate: new Date() })
	const [query, setQuery] = useState('')
	const [startItem, setStartItem] = useState(0)
	const [endItem, setEndItem] = useState(ITEMS_PER_PAGE)
	const [error, setError] = useState(null)

	useEffect(() => {
		fetchExpenses(getUserId(), dateInterval)
			.then((responseData) => setExpenses(responseData))
			.catch((error) => setError(error.response.data.message))
		fetchDebts(getUserId())
			.then((responseData) => setDebts(responseData))
			.catch((error) => setError(error.response.data.message))
		setStartItem(0)
		setEndItem(ITEMS_PER_PAGE)
	}, [dateInterval, query])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure you want to delete this expense? The source budget will credit with expense amount.')

		if (confirmDelete) {
			try {
				const expense = await axiosInstance.get(`expenses/view/${id}`)
				const budgetId = expense.data.budget
				const amount = expense.data.amount

				// Change budget to initial amount
				const budget = await axiosInstance.get(`budgets/view/${budgetId}`)
				const newBudgetAmount = Number(budget.data.currentAmount) + Number(amount)

				// Create budget log for deleted expense
				const logs = budget.data.logs

				logs.push({
					date: Date.now(),
					type: 'deleted-expense',
					currentAmount: newBudgetAmount,
					modifiedAmount: Number(amount),
				})

				await axiosInstance.put(`budgets/${budgetId}`, { currentAmount: newBudgetAmount, logs: logs })

				// Delete expense
				await axiosInstance.delete(`expenses/${id}`)

				// Refresh expenses list
				fetchExpenses(getUserId(), dateInterval)
					.then((responseData) => setExpenses(responseData))
					.catch((error) => setError(error.response.data.message))
			} catch (error) {
				error.response ? setError(error.response.data.message) : setError(error.message)
			}
		}
	}

	const handleNextButton = () => {
		setStartItem((prev) => prev + ITEMS_PER_PAGE)
		setEndItem((prev) => prev + ITEMS_PER_PAGE)
	}

	const handlePrevButton = () => {
		setStartItem((prev) => prev - ITEMS_PER_PAGE)
		setEndItem((prev) => prev - ITEMS_PER_PAGE)
	}

	return isLoggedIn() ? (
		<main>
			<h1>Expenses</h1>
			<div className="header__actions">
				<div className="buttons-group">
					<ButtonLink to="./create">Create expense</ButtonLink>
					<ButtonLink to="/user/categories">Create new category</ButtonLink>
					{parseFloat(getTotal(debts)) > 0 && <ButtonLink>Pay debt (disabled)</ButtonLink>} {/* to="./paydebt" */}
				</div>

				<SelectInterval
					onChange={(e) => setDateInterval(handleSelectIntervalChange(e))}
					label="Select date"
				/>
			</div>
			{expenses.length > 0 && (
				<div className="filter__wrapper">
					<input
						type="search"
						name=""
						id=""
						placeholder="Search terms"
						onChange={(e) => setQuery(e.target.value.toLowerCase())}
					/>
				</div>
			)}

			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}
			{expenses.length > 0 ? (
				<>
					<DataTable cols={['Date', 'Budget', 'Amount', 'Category', 'Subcategory', 'Edit', 'Delete']}>
						{expenses
							.filter((expense) =>
								String(expense.amount).concat(expense.category, expense.subcategory, expense.budget.title).toLowerCase().includes(query)
							)
							.slice(startItem, endItem)
							.map((expense) => (
								<tr key={expense._id}>
									<td>{formatDate(new Date(expense.date))}</td>
									<td>{expense.budget.title}</td>
									<td>{amountWithDecimals(expense.amount, expense.currency)}</td>
									<td>{expense.category}</td>
									<td>{expense.subcategory}</td>
									<td>
										<EditButton state={{ id: expense._id }} />
									</td>
									<td>
										<DeleteButton onClick={() => handleDelete(expense._id)} />
									</td>
								</tr>
							))}
					</DataTable>
					<Pagination
						startIndex={startItem}
						endIndex={endItem}
						dataArray={expenses}
						numberOfItemsPerPage={ITEMS_PER_PAGE}
						onClickNext={handleNextButton}
						onClickPrev={handlePrevButton}
					/>
				</>
			) : (
				<p>You don't have any expenses!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Expenses
