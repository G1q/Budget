import './Transactions.css'
import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import { formatDate } from '../../utilities/formatDates'
import { amountWithDecimals } from '../../utilities/format'
import SelectInterval from '../../components/SelectInterval/SelectInterval'

const ITEMS_PER_PAGE = 10

const Transactions = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [transactions, setTransactions] = useState([])
	const [error, setError] = useState(null)
	const [startItem, setStartItem] = useState(0)
	const [endItem, setEndItem] = useState(ITEMS_PER_PAGE)
	const [dateInterval, setDateInterval] = useState({ startDate: '1970-01-01', endDate: new Date() })

	const handleNextButton = () => {
		setStartItem((prev) => prev + ITEMS_PER_PAGE)
		setEndItem((prev) => prev + ITEMS_PER_PAGE)
	}

	const handlePrevButton = () => {
		setStartItem((prev) => prev - ITEMS_PER_PAGE)
		setEndItem((prev) => prev - ITEMS_PER_PAGE)
	}

	const getTransactions = async () => {
		try {
			const incomes = await axiosInstance(`incomes/${getUserId()}`, { params: { startDate: dateInterval.startDate, endDate: dateInterval.endDate } })
			const expenses = await axiosInstance(`expenses/${getUserId()}`, { params: { startDate: dateInterval.startDate, endDate: dateInterval.endDate } })

			setTransactions(incomes.data.concat(expenses.data))
		} catch (error) {
			setError(error.message)
		}
	}

	useEffect(() => {
		getTransactions()
	}, [dateInterval])

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
			<h1>Transactions</h1>
			<div className="header__actions">
				<div className="buttons-group">
					<Link
						to="./create"
						className="create-btn"
					>
						Create transaction
					</Link>
				</div>

				<SelectInterval onChange={handleSelectIntervalChange} />
			</div>

			{error && <p className="error-msg transaction__error-msg">{error}</p>}
			{transactions.length > 0 ? (
				<>
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
								.slice(startItem, endItem)
								.map((transaction) => (
									<tr
										key={transaction._id}
										data-type={transaction.source ? 'income' : 'expense'}
									>
										<td>{formatDate(new Date(transaction.date))}</td>
										<td>{transaction.budget.title}</td>
										<td>{amountWithDecimals(transaction.amount, transaction.currency)}</td>
										<td>{transaction.source ? 'Income' : 'Expense'}</td>
									</tr>
								))}
						</tbody>
					</table>
					<div>
						{startItem > 0 && (
							<button
								type="button"
								onClick={handlePrevButton}
							>
								Prev
							</button>
						)}
						{endItem < transactions.length && (
							<button
								type="button"
								onClick={handleNextButton}
							>
								Next
							</button>
						)}
						<p>
							{Math.ceil(endItem / ITEMS_PER_PAGE)} / {Math.ceil(transactions.length / ITEMS_PER_PAGE)} pages
						</p>
					</div>
				</>
			) : (
				<p>You don't have any transactions!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Transactions
