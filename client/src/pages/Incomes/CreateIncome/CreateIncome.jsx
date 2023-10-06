// Import dependencies
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'

// Import custom components
import Button from '../../../components/Button/Button'

// Import utilities
import axiosInstance from '../../../utilities/axiosconfig'

// Import styling
import './CreateIncome.css'
import { fetchBudgets, fetchSources } from '../../../utilities/fetchData'
import StatusMessage from '../../../components/StatusMessage/StatusMessage'

const CreateIncome = () => {
	const { getUserId } = useAuth()
	const [sources, setSources] = useState([])
	const [budgets, setBudgets] = useState([])
	const [inputs, setInputs] = useState({ user: getUserId() })
	const [error, setError] = useState('')

	useEffect(() => {
		fetchBudgets(getUserId())
			.then((responseData) => setBudgets(responseData))
			.catch((error) => setError(error.response.data.message))
		fetchSources(getUserId())
			.then((responseData) => setSources(responseData))
			.catch((error) => setError(error.response.data.message))
	}, [])

	const navigate = useNavigate()

	const handleChange = (e) => {
		setInputs((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			await axiosInstance.post('incomes', inputs)
			// Change budget to new amount
			const budgetId = inputs.budget
			const amount = inputs.amount
			const response = await axiosInstance.get(`/budgets/view/${budgetId}`)
			await axiosInstance.put(`/budgets/${budgetId}`, { currentAmount: Number(response.data.currentAmount) + Number(amount) })

			// Redirect
			navigate('/incomes')
		} catch (error) {
			setError(error.response.data.message)
		}
	}

	return (
		<main>
			<h1>Create new income</h1>
			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}
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
					<label htmlFor="source">Source</label>
					{sources.length > 0 ? (
						<select
							name="source"
							id="source"
							onChange={handleChange}
							required
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
					<p className="input__info">
						If you want to create new sources in the future, you can do that from Profile &gt; <Link to="/user/sources">Sources</Link>
					</p>
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
				<Button type="submit">Create income</Button>
			</form>
		</main>
	)
}

export default CreateIncome
