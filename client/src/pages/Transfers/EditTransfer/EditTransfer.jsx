import './EditTransfer.css'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../../utilities/axiosconfig'
import { useAuth } from '../../../contexts/AuthContext'

const EditTransfer = () => {
	const { getUserId } = useAuth()
	const { id } = useParams()
	const [budgets, setBudgets] = useState([])
	const [transfer, setTransfer] = useState('')
	const [error, setError] = useState('')
	const [initialTransfer, setInitialTransfer] = useState('')

	const navigate = useNavigate()

	const getTransfer = async () => {
		try {
			const response = await axiosInstance.get(`transfers/view/${id}`)
			setTransfer(response.data)
			setInitialTransfer(response.data)
		} catch (error) {
			setError(error.message)
		}
	}

	const getBudgets = async () => {
		try {
			const response = await axiosInstance.get(`/budgets/${getUserId()}`)
			setBudgets(response.data)
		} catch (error) {
			setError(error.message)
		}
	}

	useEffect(() => {
		getTransfer()
		getBudgets()
	}, [])

	const handleChange = (e) => {
		if (e.target.id === 'sourceId') {
			setTransfer((prev) => ({
				...prev,
				[e.target.name]: e.target.value,
				sourceTitle: e.target.selectedOptions[0].textContent,
			}))
		}
		if (e.target.id === 'budgetId') {
			setTransfer((prev) => ({
				...prev,
				[e.target.name]: e.target.value,
				budgetTitle: e.target.selectedOptions[0].textContent,
			}))
		}
		setTransfer((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			// Don't allow transfer to same budget
			if (transfer.sourceId === transfer.budgetId) {
				throw new Error("You can't transfer to same budget account!")
			}

			// Check if destination budget was changed
			if (transfer.budgetId !== initialTransfer.budgetId) {
				// Revert amount of initial budget
				const changedBudget = await axiosInstance.get(`budgets/view/${initialTransfer.budgetId}`)
				const newAmount = Number(changedBudget.data.currentAmount) - Number(initialTransfer.amount)
				await axiosInstance.put(`budgets/${initialTransfer.budgetId}`, { currentAmount: newAmount })

				// Change amount of new budget
				const newBudget = await axiosInstance.get(`budgets/view/${transfer.budgetId}`)
				const newBudgetAmount = Number(newBudget.data.currentAmount) + Number(transfer.amount)
				await axiosInstance.put(`budgets/${transfer.budgetId}`, { currentAmount: newBudgetAmount })
			}

			if (transfer.sourceId !== initialTransfer.sourceId) {
				// Revert amount of initial budget
				const changedBudget = await axiosInstance.get(`budgets/view/${initialTransfer.sourceId}`)
				const newAmount = Number(changedBudget.data.currentAmount) + Number(initialTransfer.amount)
				await axiosInstance.put(`budgets/${initialTransfer.sourceId}`, { currentAmount: newAmount })

				// Change amount of new budget
				const newBudget = await axiosInstance.get(`budgets/view/${transfer.sourceId}`)
				const newBudgetAmount = Number(newBudget.data.currentAmount) - Number(transfer.amount)
				await axiosInstance.put(`budgets/${transfer.sourceId}`, { currentAmount: newBudgetAmount })
			}

			if (transfer.amount != initialTransfer.amount) {
				// Check if amount was changed
				if (transfer.budgetId === initialTransfer.budgetId) {
					// Revert amount of initial budget
					const changedBudget = await axiosInstance.get(`budgets/view/${initialTransfer.budgetId}`)
					const newAmount = Number(changedBudget.data.currentAmount) - Number(initialTransfer.amount) + Number(transfer.amount)
					await axiosInstance.put(`budgets/${initialTransfer.budgetId}`, { currentAmount: newAmount })
				}

				if (transfer.sourceId === initialTransfer.sourceId) {
					// Revert amount of initial budget
					const changedBudget = await axiosInstance.get(`budgets/view/${initialTransfer.sourceId}`)
					const newAmount = Number(changedBudget.data.currentAmount) + Number(initialTransfer.amount) - Number(transfer.amount)
					await axiosInstance.put(`budgets/${initialTransfer.sourceId}`, { currentAmount: newAmount })
				}
			}

			await axiosInstance.put(`transfers/${id}`, transfer)
			navigate('/transfers')
		} catch (error) {
			setError(error.message)
		}
	}

	return (
		<main>
			<h1>Edit transfer</h1>
			{error && <p className="error-msg transaction__error-msg">{error}</p>}
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="sourceId">Source</label>
					{budgets.length > 0 ? (
						<select
							name="sourceId"
							id="sourceId"
							onChange={handleChange}
							required
							value={transfer.sourceId}
						>
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
							value={transfer.budgetId}
						>
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
						value={transfer.amount}
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
						value={transfer.description}
					></textarea>
				</div>
				<button type="submit">Edit transfer</button>
			</form>
		</main>
	)
}

export default EditTransfer
