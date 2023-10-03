import './CreateIncome.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utilities/axiosconfig'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../../components/Button/Button'

const CreateIncome = () => {
	const { getUserId } = useAuth()
	const [error, setError] = useState('')
	const [inputs, setInputs] = useState({ user: getUserId() })
	const [sources, setSources] = useState([])
	const [budgets, setBudgets] = useState([])

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
		getBudgets()
		getSources()
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
			const response = await axiosInstance.post('incomes', inputs)
			if (response.status === 201) {
				try {
					// Change budget to new amount
					const budgetId = inputs.budget
					const amount = inputs.amount
					const response = await axiosInstance.get(`/budgets/view/${budgetId}`)
					const res = await axiosInstance.put(`/budgets/${budgetId}`, { currentAmount: Number(response.data.currentAmount) + Number(amount) })

					// Redirect
					navigate('/incomes')
				} catch (error) {
					setError(response.data.error || 'Registration failed')
				}
			} else {
				setError(response.data.error || 'Registration failed')
			}
		} catch (error) {
			setError(error.response.data.error)
		}
	}

	return (
		<main>
			<h1>Create new income</h1>
			{error && <p className="error-message">{error}</p>}
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
