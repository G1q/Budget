import './EditCategory.css'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../../utilities/axiosconfig'

const EditCategory = () => {
	const { id } = useParams()
	const [category, setCategory] = useState('')
	const [categoryTitle, setCategoryTitle] = useState('')
	const [error, setError] = useState('')

	const navigate = useNavigate()

	const getCategory = async () => {
		try {
			const response = await axiosInstance.get(`categories/view/${id}`)
			setCategory(response.data)
			setCategoryTitle(response.data.title)
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		getCategory()
	}, [])

	const handleChange = (e) => {
		setCategory((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
		console.log(category)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await axiosInstance.put(`categories/edit/${id}`, category)
			if (response.status === 200) {
				navigate('/categories')
			} else {
				setError(response.data.error || 'Update failed')
			}
		} catch (error) {
			setError(error.response.data.error)
		}
	}

	return (
		<main>
			<h1>Edit category {categoryTitle}</h1>
			{error && <p className="error-message">{error}</p>}
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
				<button type="submit">Edit category</button>
			</form>
		</main>
	)
}

export default EditCategory
