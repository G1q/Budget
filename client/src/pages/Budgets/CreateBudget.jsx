// Import dependencies
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// Import custom elements
import Button from '../../components/Button/Button'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import CurrencySelect from '../../components/CurrencySelect/CurrencySelect'

// Import utilities
import axiosInstance from '../../utilities/axiosconfig'

const CreateBudget = () => {
	const { getUserId } = useAuth()
	const [inputs, setInputs] = useState({ user: getUserId() })
	const [error, setError] = useState(null)

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
			await axiosInstance.post('budgets', inputs)
			navigate('/budgets')
		} catch (error) {
			error.response ? setError(error.response.data.message) : setError(error.message)
		}
	}

	return (
		<main>
			<h1 className="page__title">Create new budget</h1>

			<div className="form-container">
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
						<CurrencySelect onChange={handleChange} />
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
			</div>
		</main>
	)
}

export default CreateBudget
