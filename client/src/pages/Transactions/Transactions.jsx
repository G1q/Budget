// Import dependencies
import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// Import custom components
import SelectInterval from '../../components/SelectInterval/SelectInterval'
import DataTable from '../../components/DataTable/DataTable'
import Pagination from '../../components/Pagination/Pagination'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import Loading from '../../components/Loading/Loading'

// Import utilities
import { amountWithDecimals, formatDate } from '../../utilities/format'
import { fetchTransactions } from '../../utilities/fetchData'
import { handleSelectIntervalChange } from '../../utilities/handleFunctions'

const ITEMS_PER_PAGE = 10

const Transactions = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [transactions, setTransactions] = useState([])
	const [error, setError] = useState(null)
	const [startItem, setStartItem] = useState(0)
	const [endItem, setEndItem] = useState(ITEMS_PER_PAGE)
	const [dateInterval, setDateInterval] = useState({ startDate: '1970-01-01', endDate: new Date() })
	const [isLoading, setLoading] = useState(true)

	useEffect(() => {
		fetchTransactions(getUserId(), dateInterval)
			.then((responseData) => {
				setTransactions(responseData)
				setLoading(false)
			})
			.catch((error) => setError(error.response.data.message))

		setStartItem(0)
		setEndItem(ITEMS_PER_PAGE)
	}, [dateInterval])

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
			<h1>Transactions</h1>
			<div
				className="header__actions"
				style={{ display: 'flex', justifyContent: 'flex-end' }}
			>
				<SelectInterval
					onChange={(e) => setDateInterval(handleSelectIntervalChange(e))}
					label="Select date:"
				/>
			</div>

			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}
			{isLoading ? (
				<Loading />
			) : transactions.length > 0 ? (
				<>
					<DataTable cols={['Date', 'Budget', 'Amount', 'Type']}>
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
					</DataTable>

					<Pagination
						startIndex={startItem}
						endIndex={endItem}
						dataArray={transactions}
						numberOfItemsPerPage={ITEMS_PER_PAGE}
						onClickNext={handleNextButton}
						onClickPrev={handlePrevButton}
					/>
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
