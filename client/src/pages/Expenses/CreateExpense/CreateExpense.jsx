import './CreateExpense.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utilities/axiosconfig'
import { useAuth } from '../../../contexts/AuthContext'

const CreateExpense = () => {
	const { getUserId } = useAuth()
	const [error, setError] = useState('')
	const [inputs, setInputs] = useState({ user: getUserId() })
	const [budgets, setBudgets] = useState([])
	const [categories, setCategories] = useState([])
	const [subcategories, setSubcategories] = useState([])

	const navigate = useNavigate()

	const getBudgets = async () => {
		try {
			const response = await axiosInstance.get(`/budgets/${getUserId()}`)
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
		getBudgets()
		getCategories()
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
			// Change budget to new amount
			const budgetId = inputs.budget
			const amount = inputs.amount
			const response = await axiosInstance.get(`/budgets/view/${budgetId}`)
			const newAmount = Number(response.data.currentAmount) - Number(amount)

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
					<label htmlFor="category">Category</label>
					{categories.length > 0 ? (
						<select
							name="category"
							id="category"
							onChange={(e) => {
								setInputs((prev) => ({
									...prev,
									[e.target.name]: e.target.value,
								}))
								getSubCategories(e.target.value)
							}}
							required
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
					></textarea>
				</div>
				{error && <p className="error-msg transaction__error-msg">{error}</p>}
				<button type="submit">Create expense</button>
			</form>
		</main>
	)
}

export default CreateExpense
