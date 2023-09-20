import './CreateDebt.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utilities/axiosconfig'
import { useAuth } from '../../../contexts/AuthContext'

const CreateDebt = () => {
	const { getUserId } = useAuth()
	const [error, setError] = useState(null)
	const [inputs, setInputs] = useState({ user: getUserId() })
	const [sources, setSources] = useState([])

	const getSources = async () => {
		try {
			const response = await axiosInstance(`/incomes/source/${getUserId()}`)
			setSources(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
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
			await axiosInstance.post('debts', inputs)
			// Redirect
			navigate('/debts')
		} catch (error) {
			setError(error.response.data.error)
		}
	}

	return (
		<main>
			<h1>Create new debt</h1>
			{error && <p className="error-msg transaction__error-msg">{error}</p>}
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
					<label htmlFor="creditor">Creditor</label>
					{sources.length > 0 ? (
						<select
							name="creditor"
							id="creditor"
							onChange={handleChange}
							required
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
						<Link to="/incomes">Create your first source!</Link>
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
						step={0.01}
					/>
				</div>

				<div className="form-group">
					<label htmlFor="currency">Currency</label>
					<select
						name="currency"
						id="currency"
					>
						<option value="RON">RON</option>
						<option value="EUR">EUR</option>
						<option value="USD">USD</option>
						<option value="GBP">GBP</option>
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
				<button type="submit">Create debt</button>
			</form>
		</main>
	)
}

export default CreateDebt
