// Import dependencies
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'

// Import custom components
import Button from '../../../components/Button/Button'
import StatusMessage from '../../../components/StatusMessage/StatusMessage'

// Import utilities
import axiosInstance from '../../../utilities/axiosconfig'
import { getCategory } from '../../../utilities/fetchData'

// Import styling
import './EditCategory.css'

const EditCategory = () => {
	const { isLoggedIn } = useAuth()
	const { id } = useParams()
	const [category, setCategory] = useState('')
	const [error, setError] = useState(null)

	const navigate = useNavigate()

	useEffect(() => {
		getCategory(id)
			.then((responseData) => setCategory(responseData))
			.catch((error) => setError(error.response.data.message))
	}, [])

	const handleChange = (e) => {
		setCategory((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			await axiosInstance.put(`categories/edit/${id}`, category)
			navigate('/user/categories')
		} catch (error) {
			error.response ? setError(error.response.data.message) : setError(error.message)
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Edit category</h1>
			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}

			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="title">Title</label>
					<input
						type="text"
						id="title"
						name="title"
						value={category.title}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="subcategory">Subactegory</label>
					<input
						type="text"
						id="subcategory"
						name="subcategory"
						value={category.subcategory}
						onChange={handleChange}
					/>
				</div>
				<Button type="submit">Edit category</Button>
			</form>
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default EditCategory
