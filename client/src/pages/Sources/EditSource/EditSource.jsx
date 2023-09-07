import './EditSource.css'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../../utilities/axiosconfig'

const EditSource = () => {
	const { id } = useParams()
	const [source, setSource] = useState([])
	const [error, setError] = useState('')

	const navigate = useNavigate()

	const getSource = async () => {
		try {
			const response = await axiosInstance.get(`incomes/source/view/${id}`)
			setSource(response.data)
		} catch (error) {
			setError(error.message)
		}
	}

	useEffect(() => {
		getSource()
	}, [])

	const handleChange = (e) => {
		setSource((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			await axiosInstance.put(`incomes/source/${id}`, source)
			navigate('/sources')
		} catch (error) {
			setError(error.message)
		}
	}

	return (
		<main>
			<h1>Edit income</h1>
			{error && <p className="error-msg transaction__error-msg">{error}</p>}
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="title">Title</label>
					<input
						type="text"
						name="title"
						id="title"
						onChange={handleChange}
						required
						value={source.title}
					/>
				</div>
				<button type="submit">Edit source</button>
			</form>
		</main>
	)
}

export default EditSource
