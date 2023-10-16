// Import dependencies
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

// Import custom elements
import Button from '../../components/Button/Button'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import CurrencySelect from '../../components/CurrencySelect/CurrencySelect'

// Import utilities
import axiosInstance from '../../utilities/axiosconfig'
import { getBudget } from '../../utilities/fetchData'

const EditBudget = () => {
	const { state } = useLocation()
	const id = state.id
	const [budget, setBudget] = useState('')
	const [error, setError] = useState(null)

	const navigate = useNavigate()

	useEffect(() => {
		getBudget(id)
			.then((responseData) => setBudget(responseData))
			.catch((error) => setError(error.response.data.message))
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
			const logs = budget.logs

			logs.push({
				date: Date.now(),
				type: 'update',
				currentAmount: budget.currentAmount,
			})

			const response = await axiosInstance.put(`budgets/${id}`, budget)
			navigate('/budgets')
		} catch (error) {
			error.response ? setError(error.response.data.message) : setError(error.message)
		}
	}

	return (
		<main>
			<h1 className="page__title">Edit budget</h1>
			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}
			<div className="form-container">
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
						<CurrencySelect
							value={budget.currency}
							onChange={handleChange}
						/>
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

					<Button type="submit">Edit budget</Button>
				</form>
			</div>
		</main>
	)
}

export default EditBudget
