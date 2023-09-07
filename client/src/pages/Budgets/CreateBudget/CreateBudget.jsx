import './CreateBudget.css'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utilities/axiosconfig'
import { useAuth } from '../../../contexts/AuthContext'

const CreateBudget = () => {
	const { getUserId } = useAuth()
	const [error, setError] = useState('')
	const [inputs, setInputs] = useState({ user: getUserId() })

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
			const response = await axiosInstance.post('budgets', inputs)
			if (response.status === 201) {
				navigate('/budgets')
			} else {
				setError(response.data.error || 'Registration failed')
			}
		} catch (error) {
			setError(error.response.data.error)
		}
	}

	return (
		<main>
			<h1>Create new budget</h1>
			{error && <p className="error-message">{error}</p>}
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="title">Title</label>
					<input
						type="text"
						id="title"
						name="title"
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
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="targetAmount">Target amount (optional)</label>
					<input
						type="number"
						id="targetAmount"
						name="targetAmount"
						onChange={handleChange}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="currency">Currency</label>
					<select
						name="currency"
						id="currency"
						onChange={handleChange}
					>
						<option value="RON">RON</option>
					</select>
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
				<button type="submit">Create budget</button>
			</form>
		</main>
	)
}

export default CreateBudget
