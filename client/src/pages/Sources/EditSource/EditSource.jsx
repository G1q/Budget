// Import dependencies
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'

// Import custom components
import Button from '../../../components/Button/Button'
import StatusMessage from '../../../components/StatusMessage/StatusMessage'

// Import utilities
import axiosInstance from '../../../utilities/axiosconfig'
import { getSource } from '../../../utilities/fetchData'

// Import styling
import './EditSource.css'

const EditSource = () => {
	const { isLoggedIn, getUserSettings } = useAuth()
	const { state } = useLocation()
	const id = state.id
	const [source, setSource] = useState([])
	const [error, setError] = useState(null)
	const [translations, setTranslations] = useState(null)

	const navigate = useNavigate()

	const settings = getUserSettings()
	const translate = (key) => (translations ? translations[key] : key)

	useEffect(() => {
		import(`../../../locales/languages/lang_${settings.language}.json`)
			.then((module) => setTranslations(module.default))
			.catch((error) => setError('Translation file not found:', error))
		getSource(id)
			.then((responseData) => setSource(responseData))
			.catch((error) => setError(error.response.data.message))
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
			navigate('/user/sources')
		} catch (error) {
			error.response ? setError(error.response.data.message) : setError(error.message)
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>{translate('Edit source')}</h1>

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
						name="title"
						id="title"
						onChange={handleChange}
						required
						value={source.title}
					/>
				</div>
				<Button type="submit">{translate('Edit source')}</Button>
			</form>
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default EditSource
