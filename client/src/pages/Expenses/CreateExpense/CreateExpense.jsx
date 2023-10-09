// Import dependencies
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'

// Import custom components
import Button from '../../../components/Button/Button'

// Import utilities
import axiosInstance from '../../../utilities/axiosconfig'
import { amountWithDecimals } from '../../../utilities/format'
import { fetchBudgets, fetchCategories, getSubcategories } from '../../../utilities/fetchData'

// Import styling
import './CreateExpense.css'

const CreateExpense = () => {
	const { getUserId } = useAuth()

	const [inputs, setInputs] = useState({ user: getUserId() })
	const [budgets, setBudgets] = useState([])
	const [categories, setCategories] = useState([])
	const [subcategories, setSubcategories] = useState([])
	const [selectedBudget, setSelectedBudget] = useState('')

	const [budgetError, setBudgetError] = useState(null)
	const [error, setError] = useState('')

	const navigate = useNavigate()

	useEffect(() => {
		fetchBudgets(getUserId())
			.then((responseData) => setBudgets(responseData))
			.catch((error) => setError(error.response.data.message))
		fetchCategories(getUserId())
			.then((responseData) => setCategories(responseData))
			.catch((error) => setError(error.response.data.message))
	}, [])

	const handleChange = async (e) => {
		setInputs((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
		if (e.target.name === 'budget') {
			const selectedBudget = await axiosInstance.get(`/budgets/view/${e.target.value}`)
			setSelectedBudget(selectedBudget.data)
		}
		if (e.target.name === 'amount') {
			e.target.value > selectedBudget.currentAmount
				? setBudgetError('Your budget does not meet minimum requirements for this expense')
				: setBudgetError(null)
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

			// Add to log
			const logs = response.data.logs

			logs.push({
				date: Date.now(),
				type: 'expense',
				currentAmount: newAmount,
				modifiedAmount: Number(amount),
			})

			// Check if expense is bigger than budget current amount
			if (newAmount < 0) throw new Error("You don't have minimum amount in selected budget to complete this transaction!")

			await axiosInstance.put(`/budgets/${budgetId}`, { currentAmount: newAmount, logs })
			await axiosInstance.post('expenses', inputs)

			// Redirect
			navigate('/expenses')
		} catch (error) {
			console.log(error)
			error.response ? setError(error.response.data.message) : setError(error.message)
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
						<>
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
							{selectedBudget && (
								<p className="input__info">
									Currently you have {amountWithDecimals(Number(selectedBudget.currentAmount), selectedBudget.currency)} in this budget
									account!
								</p>
							)}
						</>
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
						step={0.01}
					/>
					{budgetError && <p className="error-msg input__info	">{budgetError}</p>}
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
								getSubcategories(e.target.value, getUserId())
									.then((responseData) => setSubcategories(responseData))
									.catch((error) => setError(error.response.data.message))
							}}
							required
						>
							<option
								value=""
								hidden
							>
								Select category..
							</option>
							{categories.sort().map((category) => (
								<option
									key={category}
									value={category}
								>
									{category}
								</option>
							))}
						</select>
					) : (
						<Link to="/user/categories/">Create your first category!</Link>
					)}
					<p className="input__info">
						If you want to create new categories in the future, you can do that from Profile &gt; <Link to="/user/categories">Categories</Link>
					</p>
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
							{subcategories.sort().map((subcategory) => (
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
				<Button type="submit">Create expense</Button>
			</form>
		</main>
	)
}

export default CreateExpense
