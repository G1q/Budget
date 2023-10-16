// Import dependencies
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// Import custom components
import Button from '../../components/Button/Button'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import CurrencySelect from '../../components/CurrencySelect/CurrencySelect'
import InputMessage from '../../components/InputMessage/InputMessage'

// Import utilities
import axiosInstance from '../../utilities/axiosconfig'
import { fetchSources } from '../../utilities/fetchData'

const CreateDebt = () => {
	const { getUserId } = useAuth()
	const [sources, setSources] = useState([])
	const [inputs, setInputs] = useState({ user: getUserId() })
	const [error, setError] = useState(null)

	useEffect(() => {
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
			await axiosInstance.post('debts', inputs)
			// Redirect
			navigate('/debts')
		} catch (error) {
			setError(error.response.data.error)
		}
	}

	return (
		<main>
			<h1 className="page__title">Create new debt</h1>

			<div className="form-container">
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
							<Link to="/user/sources">Create your first source!</Link>
						)}
						<InputMessage>
							If you want to create new creditors in the future, you can do that from Profile &gt; <Link to="/user/sources">Sources</Link>
						</InputMessage>
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
					<Button type="submit">Create debt</Button>
				</form>
			</div>
		</main>
	)
}

export default CreateDebt
