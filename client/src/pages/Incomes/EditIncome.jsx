// Import dependencies
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// Import custom components
import Button from '../../components/Button/Button'
import StatusMessage from '../../components/StatusMessage/StatusMessage'

// Import utilities
import axiosInstance from '../../utilities/axiosconfig'
import { fetchBudgets, fetchSources, getIncome } from '../../utilities/fetchData'

const EditIncome = () => {
	const { getUserId } = useAuth()
	const { state } = useLocation()
	const id = state.id
	const [sources, setSources] = useState([])
	const [budgets, setBudgets] = useState([])
	const [income, setIncome] = useState('')
	const [error, setError] = useState('')
	const [initialIncome, setInitialIncome] = useState('')

	const navigate = useNavigate()

	useEffect(() => {
		fetchBudgets(getUserId())
			.then((responseData) => setBudgets(responseData))
			.catch((error) => setError(error.response.data.message))
		fetchSources(getUserId())
			.then((responseData) => setSources(responseData))
			.catch((error) => setError(error.response.data.message))
		getIncome(id)
			.then((responseData) => {
				setIncome(responseData)
				setInitialIncome(responseData)
			})
			.catch((error) => setError(error.response.data.message))
	}, [])

	const handleChange = (e) => {
		setIncome((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			// Check if budget was changed
			if (income.budget !== initialIncome.budget) {
				// Revert amount of initial budget
				const changedBudget = await axiosInstance.get(`budgets/view/${initialIncome.budget}`)
				const newAmount = Number(changedBudget.data.currentAmount) - Number(initialIncome.amount)

				// Create log for changed budget
				const changedLogs = changedBudget.data.logs

				changedLogs.push({
					date: Date.now(),
					type: 'changed-budget-income',
					currentAmount: newAmount,
					modifiedAmount: Number(initialIncome.amount),
				})

				await axiosInstance.put(`budgets/${initialIncome.budget}`, { currentAmount: newAmount, logs: changedLogs })

				// Change amount of new budget
				const newBudget = await axiosInstance.get(`budgets/view/${income.budget}`)
				const newBudgetAmount = Number(newBudget.data.currentAmount) + Number(income.amount)

				// Create log for new budget
				const newLogs = newBudget.data.logs

				newLogs.push({
					date: Date.now(),
					type: 'new-budget-income',
					currentAmount: newBudgetAmount,
					modifiedAmount: Number(income.amount),
				})

				await axiosInstance.put(`budgets/${income.budget}`, { currentAmount: newBudgetAmount, logs: newLogs })

				await axiosInstance.put(`incomes/${id}`, income)

				navigate('/incomes')
			} else if (income.amount !== initialIncome.amount) {
				// Check if amount was changed
				// Update the budget with the new amount
				const budget = await axiosInstance.get(`budgets/view/${initialIncome.budget}`)
				// New amount is: revert to original amount without this income, then add new income
				const amount = Number(budget.data.currentAmount) - Number(initialIncome.amount) + Number(income.amount)

				// Create log for changed amount
				const newAmountLog = budget.data.logs

				newAmountLog.push({
					date: Date.now(),
					type: 'new-amount-income',
					currentAmount: amount,
					modifiedAmount: Number(income.amount),
				})

				await axiosInstance.put(`budgets/${initialIncome.budget}`, { currentAmount: amount, logs: newAmountLog })

				await axiosInstance.put(`incomes/${id}`, income)
				navigate('/incomes')
			} else {
				// Updata source and description
				await axiosInstance.put(`incomes/${id}`, income)
				navigate('/incomes')
			}
		} catch (error) {
			error.response ? setError(error.response.data.message) : setError(error.message)
		}
	}

	return (
		<main>
			<h1 className="page__title">Edit income</h1>
			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}
			<div className="form-container">
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="source">Source</label>
						{sources.length > 0 ? (
							<select
								name="source"
								id="source"
								onChange={handleChange}
								required
								value={income.source}
							>
								<option
									value=""
									hidden
								>
									Select source..
								</option>
								{sources.map((source) => (
									<option
										key={source._id}
										value={source._id}
									>
										{source.title}
									</option>
								))}
							</select>
						) : (
							<Link to="/incomes">Create your first source!</Link>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="budget">Budget</label>
						{budgets.length > 0 ? (
							<select
								name="budget"
								id="budget"
								onChange={handleChange}
								required
								value={income.budget}
							>
								<option
									value=""
									hidden
								>
									Select budget..
								</option>
								{budgets.map((budget) => (
									<option
										key={budget._id}
										value={budget._id}
									>
										{budget.title}
									</option>
								))}
							</select>
						) : (
							<Link to="/budgets/create">Create your first budget!</Link>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="amount">Amount</label>
						<input
							type="number"
							name="amount"
							id="amount"
							onChange={handleChange}
							required
							value={income.amount}
							step={0.01}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="description">Description</label>
						<textarea
							name="description"
							id="description"
							cols="30"
							rows="10"
							onChange={handleChange}
							value={income.description}
						></textarea>
					</div>
					<Button type="submit">Edit income</Button>
				</form>
			</div>
		</main>
	)
}

export default EditIncome
