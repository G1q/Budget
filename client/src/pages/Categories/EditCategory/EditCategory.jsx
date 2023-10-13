// Import dependencies
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
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
	const { isLoggedIn, getUserSettings } = useAuth()
	const { state } = useLocation()
	const id = state.id
	const [category, setCategory] = useState('')
	const [error, setError] = useState(null)
	const [translations, setTranslations] = useState(null)

	const settings = getUserSettings()
	const translate = (key) => (translations ? translations[key] : key)

	const navigate = useNavigate()

	useEffect(() => {
		import(`../../../locales/languages/lang_${settings.language}.json`)
			.then((module) => setTranslations(module.default))
			.catch((error) => setError('Translation file not found:', error))
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
			<h1>{translate('Edit category')}</h1>
			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}

			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="title">{translate('Title')}</label>
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
					<label htmlFor="subcategory">{translate('Subcategory')}</label>
					<input
						type="text"
						id="subcategory"
						name="subcategory"
						value={category.subcategory}
						onChange={handleChange}
					/>
				</div>
				<Button type="submit">{translate('Edit category')}</Button>
			</form>
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default EditCategory
