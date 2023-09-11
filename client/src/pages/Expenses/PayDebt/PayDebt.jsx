import './PayDebt.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utilities/axiosconfig'
import { useAuth } from '../../../contexts/AuthContext'

const PayDebt = () => {
	const { getUserId } = useAuth()
	const [error, setError] = useState('')
	const [inputs, setInputs] = useState({ user: getUserId(), category: 'Debt' })
	const [budgets, setBudgets] = useState([])
	const [debts, setDebts] = useState([])

	const navigate = useNavigate()

	const getBudgets = async () => {
		try {
			const response = await axiosInstance.get(`/budgets/${getUserId()}`)
			setBudgets(response.data)
		} catch (error) {
			setError(error.message)
		}
	}

	const getDebts = async () => {
		try {
			const response = await axiosInstance.get(`/debts/${getUserId()}`)
			setDebts(response.data)
		} catch (error) {
			setError(error.message)
		}
	}

	useEffect(() => {
		getBudgets()
		getDebts()
	}, [])

	const handleChange = (e) => {
		setInputs((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const editDebt = async (debtId) => {
		try {
			const debt = await axiosInstance.get(`/debts/view/${debtId}`)
			const newDebtAmount = Number(debt.data.currentAmount) - Number(inputs.amount)
			await axiosInstance.put(`/debts/${debtId}`, { currentAmount: newDebtAmount })
		} catch (error) {
			setError(error.message)
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			// Change budget to new amount
			const budgetId = inputs.budget
			const amount = inputs.amount
			const response = await axiosInstance.get(`/budgets/view/${budgetId}`)
			const newAmount = Number(response.data.currentAmount) - Number(amount)

			editDebt(inputs.subcategory)

			// Check if expense is bigger than budget current amount
			if (newAmount < 0) {
				throw new Error("You don't have minimum amount in selected budget to complete this transaction!")
			} else {
				await axiosInstance.put(`/budgets/${budgetId}`, { currentAmount: newAmount })
				await axiosInstance.post('expenses', inputs)
			}

			// Redirect
			navigate('/expenses')
		} catch (error) {
			setError(error.message)
		}
	}

	return (
		<main>
			<h1>Create new debt payment</h1>

			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="date">Date</label>
					<input
						type="date"
						id="date"
						name="date"
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="budget">Budget</label>
					{budgets.length > 0 ? (
						<select
							name="budget"
							id="budget"
							onChange={handleChange}
							required
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
					<label htmlFor="subcategory">Debts</label>
					{debts.length > 0 ? (
						<select
							name="subcategory"
							id="subcategory"
							onChange={handleChange}
							required
						>
							<option
								value=""
								hidden
							>
								Select debt..
							</option>
							{debts.map((debt) => (
								<option
									key={debt._id}
									value={debt._id}
								>
									{debt.creditor.title}
								</option>
							))}
						</select>
					) : (
						<Link to="/debts/create">Create your first debt!</Link>
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
					></textarea>
				</div>
				{error && <p className="error-msg transaction__error-msg">{error}</p>}
				<button type="submit">Create new payment</button>
			</form>
		</main>
	)
}

export default PayDebt
