import './Incomes.css'
import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import { openDialog, clearForm, closeDialog } from '../../utilities/popup'
import { formatDate } from '../../utilities/formatDates'
import { amountWithDecimals } from '../../utilities/format'
import SelectInterval from '../../components/SelectInterval/SelectInterval'
import Button from '../../components/Button/Button'
import ButtonLink from '../../components/ButtonLink/ButtonLink'

const Incomes = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [incomes, setIncomes] = useState([])
	const [sourceTitle, setSourceTitle] = useState('')
	const [sourceError, setSourceError] = useState('')
	const [budgetError, setBudgetError] = useState('')
	const [dateInterval, setDateInterval] = useState({ startDate: '1970-01-01', endDate: new Date() })

	useEffect(() => {
		getIncomes()
	}, [dateInterval])

	const getIncomes = async () => {
		try {
			const response = await axiosInstance.get(`incomes/${getUserId()}`, {
				params: { startDate: dateInterval.startDate, endDate: dateInterval.endDate },
			})
			setIncomes(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this income? The source budget will debit with income amount.')

		if (confirmDelete) {
			try {
				const income = await axiosInstance.get(`incomes/view/${id}`)
				const budgetId = income.data.budget
				const amount = income.data.amount

				// Change budget to initial amount
				const budget = await axiosInstance.get(`budgets/view/${budgetId}`)
				const newAmount = Number(budget.data.currentAmount) - Number(amount)

				if (newAmount < 0) throw new Error('Budget will decrease under 0. Please check again!')

				await axiosInstance.put(`budgets/${budgetId}`, { currentAmount: newAmount })
				setBudgetError('')

				// Delete income
				await axiosInstance.delete(`incomes/${id}`)

				// Refresh incomes list
				getIncomes()
			} catch (error) {
				setBudgetError(error)
			}
		}
	}

	const handleCreateSource = async (e) => {
		e.preventDefault()
		try {
			const source = {
				title: sourceTitle,
				user: getUserId(),
			}
			const response = await axiosInstance.post('incomes/source', source)
			if (response.status === 201) {
				setSourceError('')
				clearForm()
				navigate('/incomes')
			} else {
				setSourceError(response.data.error || 'Registration failed')
			}
		} catch (error) {
			setSourceError(error.response.data.error)
		}
	}

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
			<h1>Incomes</h1>
			<div className="header__actions">
				<div className="buttons-group">
					<ButtonLink to="./create">Create income</ButtonLink>

					<Button
						id="create-source__btn"
						onClick={openDialog}
						className="popup-btn"
					>
						Create new source
					</Button>
				</div>

				<SelectInterval
					onChange={handleSelectIntervalChange}
					label="Select date"
				/>
			</div>

			<dialog
				className="popup-dialog"
				id="create-source-dialog"
			>
				<h2 className="popup-dialog__title">Create new source</h2>
				<button
					className="popup-close-btn"
					onClick={closeDialog}
				>
					&times;
				</button>
				<form
					className="popup-dialog__form"
					onSubmit={handleCreateSource}
				>
					<label htmlFor="title">Title</label>
					<input
						type="text"
						name="title"
						id="title"
						onChange={(e) => setSourceTitle(e.target.value)}
					/>
					<button>Create source</button>
					<p className="error-msg">{sourceError}</p>
				</form>
			</dialog>

			{budgetError && <p className="error-msg transaction__error-msg">{budgetError.message}</p>}
			{incomes.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Source</th>
							<th>Budget</th>
							<th>Amount</th>
							<th>Edit income</th>
							<th>Delete income</th>
						</tr>
					</thead>
					<tbody>
						{incomes.map((income) => (
							<tr key={income._id}>
								<td>{formatDate(new Date(income.date))}</td>
								<td>{income.source.title}</td>
								<td>{income.budget.title}</td>
								<td>{amountWithDecimals(income.amount, income.currency)}</td>
								<td>
									<Link
										className="edit-btn"
										to={`/incomes/edit/${income._id}`}
									>
										Edit
									</Link>
								</td>
								<td>
									<button
										className="delete-btn"
										onClick={() => handleDelete(income._id)}
									>
										&times;
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>You don't have any incomes!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Incomes
