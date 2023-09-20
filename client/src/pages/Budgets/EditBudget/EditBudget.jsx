import { useEffect, useState } from 'react'
import './EditBudget.css'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../../utilities/axiosconfig'

const EditBudget = () => {
	const { id } = useParams()
	const [budget, setBudget] = useState('')
	const [budgetTitle, setBudgetTitle] = useState('')
	const [error, setError] = useState('')

	const navigate = useNavigate()

	const getBudget = async () => {
		try {
			const response = await axiosInstance.get(`budgets/view/${id}`)
			setBudget(response.data)
			setBudgetTitle(response.data.title)
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		getBudget()
	}, [])

	const handleChange = (e) => {
		setBudget((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await axiosInstance.put(`budgets/${id}`, budget)
			if (response.status === 200) {
				navigate('/budgets')
			} else {
				setError(response.data.error || 'Update failed')
			}
		} catch (error) {
			setError(error.response.data.error)
		}
	}

	return (
		<main>
			<h1>Edit budget {budgetTitle}</h1>
			{error && <p className="error-message">{error}</p>}
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="title">Title</label>
					<input
						type="text"
						id="title"
						name="title"
						value={budget.title}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="startAmount">Start amount</label>
					<input
						type="number"
						id="startAmount"
						name="startAmount"
						value={budget.startAmount}
						onChange={handleChange}
						required
						step={0.01}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="currentAmount">Current amount</label>
					<input
						type="number"
						id="currentAmount"
						name="currentAmount"
						value={budget.currentAmount}
						onChange={handleChange}
						required
						step={0.01}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="targetAmount">Target amount</label>
					<input
						type="number"
						id="targetAmount"
						name="targetAmount"
						value={budget.targetAmount}
						onChange={handleChange}
						required
						step={0.01}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="currency">Currency</label>
					<select
						name="currency"
						id="currency"
						value={budget.currency}
						onChange={handleChange}
					>
						<option value="RON">RON</option>
						<option
							value="EUR"
							disabled
						>
							EUR
						</option>
						<option
							value="USD"
							disabled
						>
							USD
						</option>
					</select>
				</div>

				<div className="form-group">
					<label htmlFor="description">Description</label>
					<textarea
						name="description"
						id="description"
						cols="30"
						rows="10"
						value={budget.description}
						onChange={handleChange}
					></textarea>
				</div>
				<button type="submit">Edit budget</button>
			</form>
		</main>
	)
}

export default EditBudget
