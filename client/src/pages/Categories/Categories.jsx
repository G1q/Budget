// Import dependencies
import { Navigate } from 'react-router-dom'
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
	const { getUserId, isLoggedIn, getUserSettings } = useAuth()
	const [categories, setCategories] = useState([])
	const [categoryTitle, setCategoryTitle] = useState('')
	const [subcategoryTitle, setSubcategoryTitle] = useState('')
	const [query, setQuery] = useState('')
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)
	const [translations, setTranslations] = useState(null)

	const settings = getUserSettings()
	const translate = (key) => (translations ? translations[key] : key)

	useEffect(() => {
		import(`../../locales/languages/lang_${settings.language}.json`)
			.then((module) => setTranslations(module.default))
			.catch((error) => setError('Translation file not found:', error))
		fetchAllCategories(getUserId())
			.then((responseData) => setCategories(responseData))
			.catch((error) => setError(error.response.data.message))
	}, [query])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm(translate('Are you sure do you want delete this category?'))

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
			<h1>{translate('Categories')}</h1>
			<div className="header__actions">
				<div className="buttons-group">
					<Button
						onClick={openDialog}
						className="popup-btn"
					>
						{translate('Create new category')}
					</Button>
				</div>
			</div>

			<Dialog
				title={translate('Create new category')}
				textButton={translate('Create category')}
				onClick={closeDialog}
				onSubmit={handleSubmit}
			>
				<label htmlFor="title">{translate('Title')}</label>
				<input
					type="text"
					name="title"
					id="title"
					onChange={(e) => setCategoryTitle(e.target.value)}
				/>

				<label htmlFor="subcategory">{translate('Subcategory title')}</label>
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

			{categories.length > 0 && (
				<div className="filter__wrapper">
					<input
						type="search"
						name=""
						id=""
						placeholder={translate('Search terms')}
						onChange={(e) => setQuery(e.target.value.toLowerCase())}
					/>
				</div>
			)}

			{categories.length > 0 ? (
				<DataTable cols={[translate('Category'), translate('Subcategory'), translate('Edit'), translate('Delete')]}>
					{categories
						.filter((category) => String(category.title).concat(category.subcategory).toLowerCase().includes(query))
						.map((category) => (
							<tr key={category._id}>
								<td>{category.title}</td>
								<td>{category.subcategory}</td>
								<td>
									<EditButton state={{ id: category._id }} />
								</td>
								<td>
									<DeleteButton onClick={() => handleDelete(category._id)} />
								</td>
							</tr>
						))}
				</DataTable>
			) : (
				<p>{translate("You don't have any categories created!")}</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Categories
