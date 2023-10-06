// Import dependencies
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'

// Import custom elements
import Button from '../../../components/Button/Button'
import StatusMessage from '../../../components/StatusMessage/StatusMessage'
import CurrencySelect from '../../../components/CurrencySelect/CurrencySelect'

// Import utilities
import axiosInstance from '../../../utilities/axiosconfig'

// Import styling
import './CreateBudget.css'

const CreateBudget = () => {
	const { getUserId } = useAuth()
	const [inputs, setInputs] = useState({ user: getUserId() })
	const [error, setError] = useState('')

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
						step={0.01}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="targetAmount">Target amount (optional)</label>
					<input
						type="number"
						id="targetAmount"
						name="targetAmount"
						onChange={handleChange}
						step={0.01}
					/>
				</div>

				<div className="form-group">
					<CurrencySelect />
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
				{error && (
					<StatusMessage
						type="error"
						message={error}
					/>
				)}
				<Button type="submit">Create budget</Button>
			</form>
		</main>
	)
}

export default CreateBudget
