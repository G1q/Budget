// Import dependencies
import { Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// Import custom components
import Button from '../../components/Button/Button'
import Dialog, { openDialog, closeDialog } from '../../components/Dialog/Dialog'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import DataTable from '../../components/DataTable/DataTable'
import EditButton from '../../components/EditButton/EditButton'
import DeleteButton from '../../components/DeleteButton/DeleteButton'

// Import utilities
import axiosInstance from '../../utilities/axiosconfig'
import { fetchAllCategories } from '../../utilities/fetchData'

// Import styling
import './Categories.css'

const Categories = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [categories, setCategories] = useState([])
	const [categoryTitle, setCategoryTitle] = useState('')
	const [subcategoryTitle, setSubcategoryTitle] = useState('')
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)

	const navigate = useNavigate()

	useEffect(() => {
		fetchAllCategories(getUserId())
			.then((responseData) => setCategories(responseData))
			.catch((error) => setError(error.response.data.message))
	}, [])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this category?')

		if (confirmDelete) {
			try {
				const response = await axiosInstance.delete(`categories/${id}`)
				setError(null)
				setSuccess(response.data.message)

				fetchAllCategories(getUserId())
					.then((responseData) => setCategories(responseData))
					.catch((error) => setError(error.response.data.message))
			} catch (error) {
				setSuccess(null)
				error.response ? setError(error.response.data.message) : setError(error.message)
			}
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const category = {
				title: categoryTitle,
				user: getUserId(),
				subcategory: subcategoryTitle,
			}
			const response = await axiosInstance.post('categories', category)
			closeDialog()
			setError(null)
			setSuccess(response.data.message)
			fetchAllCategories(getUserId())
				.then((responseData) => setCategories(responseData))
				.catch((error) => setError(error.response.data.message))
		} catch (error) {
			setSuccess(null)
			error.response ? setError(error.response.data.message) : setError(error.message)
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Categories</h1>
			<div className="header__actions">
				<div className="buttons-group">
					<Button
						onClick={openDialog}
						className="popup-btn"
					>
						Create new category
					</Button>
				</div>
			</div>

			<Dialog
				title="Create new category"
				textButton="Create category"
				onClick={closeDialog}
				onSubmit={handleSubmit}
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
				{error && (
					<StatusMessage
						type="error"
						message={error}
					/>
				)}
			</Dialog>

			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}
			{success && (
				<StatusMessage
					type="success"
					message={success}
				/>
			)}

			{categories.length > 0 ? (
				<DataTable cols={['Category', 'Subcategory', 'Edit category', 'Delete category']}>
					{categories.map((category) => (
						<tr key={category._id}>
							<td>{category.title}</td>
							<td>{category.subcategory}</td>
							<td>
								<EditButton to={`/user/categories/edit/${category._id}`} />
							</td>
							<td>
								<DeleteButton onClick={() => handleDelete(category._id)} />
							</td>
						</tr>
					))}
				</DataTable>
			) : (
				<p>You don't have any categories created!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Categories
