/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utilities/axiosconfig'
import Button from '../../components/Button/Button'
import StatusMessage from '../../components/StatusMessage/StatusMessage'

const EditProfile = () => {
	const { getUserId, getUserSettings } = useAuth()
	const [profile, setProfile] = useState({ username: '', email: '' })
	const [error, setError] = useState(null)
	const [translations, setTranslations] = useState(null)

	const navigate = useNavigate()

	const settings = getUserSettings()
	const translate = (key) => (translations ? translations[key] : key)

	useEffect(() => {
		import(`../../locales/languages/lang_${settings.language}.json`)
			.then((module) => setTranslations(module.default))
			.catch((error) => setError('Translation file not found:', error))
		getProfile()
	}, [])

	const getProfile = async () => {
		try {
			const response = await axiosInstance.get(`users/profile/${getUserId()}`)
			setProfile(response.data)
		} catch (error) {
			error.response ? setError(error.response.data.message) : setError(error.message)
		}
	}

	const handleChange = (e) => {
		setProfile((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			await axiosInstance.put(`users/edit/${getUserId()}`, profile)
			navigate('/user/profile')
		} catch (error) {
			error.response ? setError(error.response.data.message) : setError(error.message)
		}
	}

	return (
		<section className="page__section">
			<h1 className="page__title">{translate('Edit my profile')}</h1>

			<div className="form-container">
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="username">{translate('Username:')}</label>
						<input
							type="text"
							name="username"
							id="username"
							value={profile.username}
							onChange={handleChange}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="email">{translate('Email:')}</label>
						<input
							type="email"
							name="email"
							id="email"
							value={profile.email}
							onChange={handleChange}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">{translate('Password:')}</label>
						<input
							type="password"
							name="password"
							id="password"
							onChange={handleChange}
						/>
					</div>

					<Button type="submit">{translate('Save changes')}</Button>
					{error && (
						<StatusMessage
							type="error"
							message={error}
						/>
					)}
				</form>
			</div>
		</section>
	)
}

export default EditProfile
