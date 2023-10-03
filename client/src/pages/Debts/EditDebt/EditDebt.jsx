import './EditDebt.css'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../../utilities/axiosconfig'
import { useAuth } from '../../../contexts/AuthContext'
import Button from '../../../components/Button/Button'

const EditDebt = () => {
	const { getUserId } = useAuth()
	const { id } = useParams()
	const [sources, setSources] = useState([])
	const [debt, setDebt] = useState('')
	const [error, setError] = useState('')

	const navigate = useNavigate()

	const getSources = async () => {
		try {
			const response = await axiosInstance(`/incomes/source/${getUserId()}`)
			setSources(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	const getDebt = async () => {
		try {
			const response = await axiosInstance(`/debts/view/${id}`)
			setDebt(response.data)
		} catch (error) {
			setError(error.message)
		}
	}

	useEffect(() => {
		getSources()
		getDebt()
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
			setError(error.message)
		}
	}

	return (
		<main>
			<h1>Edit debt</h1>
			{error && <p className="error-msg transaction__error-msg">{error}</p>}
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
