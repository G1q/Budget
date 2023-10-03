import './EditIncome.css'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../../utilities/axiosconfig'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../../components/Button/Button'

const EditIncome = () => {
	const { getUserId } = useAuth()
	const { id } = useParams()
	const [sources, setSources] = useState([])
	const [budgets, setBudgets] = useState([])
	const [income, setIncome] = useState('')
	const [error, setError] = useState('')
	const [initialIncome, setInitialIncome] = useState('')

	const navigate = useNavigate()

	const getIncome = async () => {
		try {
			const response = await axiosInstance.get(`incomes/view/${id}`)
			setIncome(response.data)
			setInitialIncome(response.data)
		} catch (err) {
			console.log(err)
		}
	}

	const getBudgets = async () => {
		try {
			const response = await axiosInstance(`/budgets/${getUserId()}`)
			setBudgets(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	const getSources = async () => {
		try {
			const response = await axiosInstance(`/incomes/source/${getUserId()}`)
			setSources(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getIncome()
		getBudgets()
		getSources()
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
				await axiosInstance.put(`budgets/${initialIncome.budget}`, { currentAmount: newAmount })

				// Change amount of new budget
				const newBudget = await axiosInstance.get(`budgets/view/${income.budget}`)
				const newBudgetAmount = Number(newBudget.data.currentAmount) + Number(income.amount)
				await axiosInstance.put(`budgets/${income.budget}`, { currentAmount: newBudgetAmount })

				await axiosInstance.put(`incomes/${id}`, income)

				navigate('/incomes')
			} else if (income.amount !== initialIncome.amount) {
				// Check if amount was changed
				// Update the budget with the new amount
				const budget = await axiosInstance.get(`budgets/view/${initialIncome.budget}`)
				// New amount is: revert to original amount without this income, then add new income
				const amount = Number(budget.data.currentAmount) - Number(initialIncome.amount) + Number(income.amount)
				await axiosInstance.put(`budgets/${initialIncome.budget}`, { currentAmount: amount })

				await axiosInstance.put(`incomes/${id}`, income)
				navigate('/incomes')
			} else {
				// Updata source and description
				await axiosInstance.put(`incomes/${id}`, income)
				navigate('/incomes')
			}
		} catch (error) {
			setError(error.message)
		}
	}

	return (
		<main>
			<h1>Edit income</h1>
			{error && <p className="error-msg transaction__error-msg">{error}</p>}
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
		</main>
	)
}

export default EditIncome
