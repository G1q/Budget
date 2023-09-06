import './CreateTransfer.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utilities/axiosconfig'
import { useAuth } from '../../../contexts/AuthContext'

const CreateTransfer = () => {
	const { getUserId } = useAuth()
	const [error, setError] = useState('')
	const [inputs, setInputs] = useState({ user: getUserId() })
	const [budgets, setBudgets] = useState([])

	const navigate = useNavigate()

	const getBudgets = async () => {
		try {
			const response = await axiosInstance.get(`/budgets/${getUserId()}`)
			setBudgets(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getBudgets()
	}, [])

	const handleChange = (e) => {
		setInputs((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			const sourceBudget = await axiosInstance.get(`/budgets/view/${inputs.sourceId}`)
			const destinationBudget = await axiosInstance.get(`/budgets/view/${inputs.budgetId}`)

			setInputs((prev) => ({
				...prev,
				sourceTitle: sourceBudget.data.title,
				budgetTitle: destinationBudget.data.title,
			}))

			// Change new budgets
			const amount = inputs.amount
			const newSourceAmount = Number(sourceBudget.data.currentAmount) - Number(amount)
			const newDestinationAmount = Number(destinationBudget.data.currentAmount) + Number(amount)

			if (newSourceAmount < 0) {
				throw new Error("You don't have this amount in source budget!")
			} else {
				await axiosInstance.put(`/budgets/${inputs.sourceId}`, { currentAmount: newSourceAmount })
				console.log('1')
				await axiosInstance.put(`/budgets/${inputs.budgetId}`, { currentAmount: newDestinationAmount })
				console.log('2')
				console.log(inputs)
				await axiosInstance.post('transfers', inputs)
				console.log('3')
			}

			// Redirect
			navigate('/transfers')
		} catch (error) {
			setError(error.message)
		}
	}

	return (
		<main>
			<h1>Create new expense</h1>

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
					<label htmlFor="sourceId">Source</label>
					{budgets.length > 0 ? (
						<select
							name="sourceId"
							id="sourceId"
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
					<label htmlFor="budgetId">Budget</label>
					{budgets.length > 0 ? (
						<select
							name="budgetId"
							id="budgetId"
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
					<label htmlFor="amount">Amount</label>
					<input
						type="number"
						name="amount"
						id="amount"
						onChange={handleChange}
						required
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
				<button type="submit">Create transfer</button>
			</form>
		</main>
	)
}

export default CreateTransfer
