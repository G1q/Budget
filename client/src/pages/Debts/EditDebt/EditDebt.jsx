// Import dependencies
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'

// Import custom components
import Button from '../../../components/Button/Button'
import StatusMessage from '../../../components/StatusMessage/StatusMessage'

// Import utilities
import axiosInstance from '../../../utilities/axiosconfig'
import { fetchSources, getDebt } from '../../../utilities/fetchData'

// Import styling
import './EditDebt.css'

const EditDebt = () => {
	const { getUserId } = useAuth()
	const { state } = useLocation()
	const id = state.id
	const [debt, setDebt] = useState('')
	const [sources, setSources] = useState([])
	const [error, setError] = useState(null)

	const navigate = useNavigate()

	useEffect(() => {
		fetchSources(getUserId())
			.then((responseData) => setSources(responseData))
			.catch((error) => setError(error.response.data.message))
		getDebt(id)
			.then((responseData) => setDebt(responseData))
			.catch((error) => setError(error.response.data.message))
	}, [])

	const handleChange = (e) => {
		setDebt((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			await axiosInstance.put(`debts/${id}`, debt)
			navigate('/debts')
		} catch (error) {
			setError(error.response.data.message)
		}
	}

	return (
		<main>
			<h1>Edit debt</h1>
			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="creditor">Creditor</label>
					{sources.length > 0 ? (
						<select
							name="creditor"
							id="creditor"
							onChange={handleChange}
							required
							value={debt.creditor}
						>
							<option
								value=""
								hidden
							>
								Select creditor..
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
						<Link to="/user/sources">Create your first source!</Link>
					)}
				</div>

				<div className="form-group">
					<label htmlFor="startAmount">Start amount</label>
					<input
						type="number"
						name="startAmount"
						id="startAmount"
						onChange={handleChange}
						required
						value={debt.startAmount}
						step={0.01}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="currentAmount">Current amount</label>
					<input
						type="number"
						name="currentAmount"
						id="currentAmount"
						onChange={handleChange}
						required
						value={debt.currentAmount}
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
						value={debt.description}
					></textarea>
				</div>
				<Button type="submit">Edit debt</Button>
			</form>
		</main>
	)
}

export default EditDebt
