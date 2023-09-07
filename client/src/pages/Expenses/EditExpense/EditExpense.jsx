import './EditExpense.css'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../../utilities/axiosconfig'
import { useAuth } from '../../../contexts/AuthContext'

const EditExpense = () => {
	const { getUserId } = useAuth()
	const { id } = useParams()
	const [budgets, setBudgets] = useState([])
	const [expense, setExpense] = useState('')
	const [error, setError] = useState('')
	const [initialExpense, setInitialExpense] = useState('')
	const [categories, setCategories] = useState([])
	const [subcategories, setSubcategories] = useState([])

	const navigate = useNavigate()

	const getExpense = async () => {
		try {
			const response = await axiosInstance.get(`expenses/view/${id}`)
			setExpense(response.data)
			setInitialExpense(response.data)
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

	const getCategories = async () => {
		try {
			const response = await axiosInstance.get(`/categories//${getUserId()}`)
			setCategories([...new Set(response.data.map((cat) => cat.title))])
		} catch (error) {
			console.log(error)
		}
	}

	const getSubCategories = async (currentCategory) => {
		try {
			const response = await axiosInstance.get(`/categories/${getUserId()}`)
			setSubcategories([...new Set(response.data.filter((cat) => cat.title === currentCategory).map((cat) => cat.subcategory))])
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getExpense()
		getBudgets()
		getCategories()
	}, [])

	const handleChange = (e) => {
		setExpense((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			// Check if budget was changed
			if (expense.budget !== initialExpense.budget) {
				// Revert amount of initial budget
				const changedBudget = await axiosInstance.get(`budgets/view/${initialExpense.budget}`)
				const newAmount = Number(changedBudget.data.currentAmount) + Number(initialExpense.amount)
				await axiosInstance.put(`budgets/${initialExpense.budget}`, { currentAmount: newAmount })

				// Change amount of new budget
				const newBudget = await axiosInstance.get(`budgets/view/${expense.budget}`)
				const newBudgetAmount = Number(newBudget.data.currentAmount) - Number(expense.amount)
				await axiosInstance.put(`budgets/${expense.budget}`, { currentAmount: newBudgetAmount })

				await axiosInstance.put(`expenses/${id}`, expense)

				navigate('/expenses')
			} else if (expense.amount !== initialExpense.amount) {
				// Check if amount was changed
				// Update the budget with the new amount
				const budget = await axiosInstance.get(`budgets/view/${initialExpense.budget}`)
				// New amount is: revert to original amount without this expense, then add new expense
				const amount = Number(budget.data.currentAmount) + Number(initialExpense.amount) - Number(expense.amount)
				await axiosInstance.put(`budgets/${initialExpense.budget}`, { currentAmount: amount })

				await axiosInstance.put(`expenses/${id}`, expense)
				navigate('/expenses')
			} else {
				// Updata source and description
				await axiosInstance.put(`expenses/${id}`, expense)
				navigate('/expenses')
			}
		} catch (error) {
			setError(error.message)
		}
	}

	return (
		<main>
			<h1>Edit expense</h1>
			{error && <p className="error-msg transaction__error-msg">{error}</p>}
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="budget">Budget</label>
					{budgets.length > 0 ? (
						<select
							name="budget"
							id="budget"
							onChange={handleChange}
							required
							value={expense.budget}
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
						value={expense.amount}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="category">Category</label>
					{categories.length > 0 ? (
						<select
							name="category"
							id="category"
							onChange={(e) => {
								setExpense((prev) => ({
									...prev,
									[e.target.name]: e.target.value,
								}))
								getSubCategories(e.target.value)
							}}
							required
							value={expense.category}
						>
							<option
								value=""
								hidden
							>
								Select category..
							</option>
							{categories.map((category) => (
								<option
									key={category}
									value={category}
								>
									{category}
								</option>
							))}
						</select>
					) : (
						<Link to="/categories/">Create your first category!</Link>
					)}
				</div>

				{subcategories.length > 0 ? (
					<div className="form-group">
						<label htmlFor="subcategory">Subcategory</label>
						<select
							name="subcategory"
							id="subcategory"
							onChange={handleChange}
							value={expense.subcategory}
						>
							<option
								value=""
								hidden
							>
								Select subcategory..
							</option>
							{subcategories.map((subcategory) => (
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

				<div className="form-group">
					<label htmlFor="description">Description</label>
					<textarea
						name="description"
						id="description"
						cols="30"
						rows="10"
						onChange={handleChange}
						value={expense.description}
					></textarea>
				</div>
				<button type="submit">Edit expense</button>
			</form>
		</main>
	)
}

export default EditExpense
