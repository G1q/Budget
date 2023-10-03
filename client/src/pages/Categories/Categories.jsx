import { Link, Navigate, useNavigate } from 'react-router-dom'
import './Categories.css'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import { openDialog, clearForm, closeDialog } from '../../utilities/popup'
import Button from '../../components/Button/Button'

const Categories = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [categories, setCategories] = useState([])
	const [error, setError] = useState('')
	const [categoryTitle, setCategoryTitle] = useState('')
	const [subcategoryTitle, setSubcategoryTitle] = useState('')

	const navigate = useNavigate()

	const getCategories = async () => {
		try {
			const response = await axiosInstance(`categories/${getUserId()}`)
			setCategories(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getCategories()
	}, [])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this category?')

		if (confirmDelete) {
			try {
				const response = await axiosInstance.delete(`categories/${id}`)
				getCategories()
			} catch (error) {
				console.log(error)
			}
		}
	}

	const handleCreateCategory = async (e) => {
		e.preventDefault()
		try {
			const category = {
				title: categoryTitle,
				user: getUserId(),
				subcategory: subcategoryTitle,
			}
			const response = await axiosInstance.post('categories', category)
			console.log(response)
			if (response.status === 201) {
				setError('')
				clearForm()
				navigate(0)
			} else {
				setError(response.data.error || 'Registration failed')
			}
		} catch (error) {
			setError(error.response.data.error || 'Internal error')
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Categories</h1>
			<div className="buttons-group">
				<Button
					className="popup-btn"
					id="create-category__btn"
					onClick={openDialog}
				>
					Create new category
				</Button>
			</div>

			<dialog
				className="popup-dialog"
				id="create-source-dialog"
			>
				<h2 className="popup-dialog__title">Create new category</h2>
				<button
					className="popup-close-btn"
					onClick={closeDialog}
				>
					&times;
				</button>
				<form
					className="popup-dialog__form"
					onSubmit={handleCreateCategory}
				>
					<label htmlFor="title">Title</label>
					<input
						type="text"
						name="title"
						id="title"
						onChange={(e) => setCategoryTitle(e.target.value)}
					/>

					<label htmlFor="subcategory">Subcategory title</label>
					<input
						type="text"
						name="subcategory"
						id="subcategory"
						onChange={(e) => setSubcategoryTitle(e.target.value)}
					/>
					<button>Create category</button>
					<p className="error-msg">{error}</p>
				</form>
			</dialog>

			{categories.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>Category</th>
							<th>Subcategory</th>
							<th>Edit category</th>
							<th>Delete category</th>
						</tr>
					</thead>
					<tbody>
						{categories.map((category) => (
							<tr key={category._id}>
								<td>{category.title}</td>
								<td>{category.subcategory}</td>
								<td>
									<Link
										className="edit-btn"
										to={`/user/categories/edit/${category._id}`}
									>
										Edit
									</Link>
								</td>
								<td>
									<button
										className="delete-btn"
										onClick={() => handleDelete(category._id)}
									>
										&times;
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>Please create your first category to start!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Categories
