import './EditProfile.css'
import { useAuth } from '../../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../../utilities/axiosconfig'
import Button from '../../../components/Button/Button'

const EditProfile = () => {
	const { getUserId, getUserSettings } = useAuth()
	const [profile, setProfile] = useState({ username: '', email: '' })
	const [error, setError] = useState(null)
	const [translations, setTranslations] = useState(null)

	const navigate = useNavigate()

	const settings = getUserSettings()
	const translate = (key) => (translations ? translations[key] : key)

	useEffect(() => {
		import(`../../../locales/languages/lang_${settings.language}.json`)
			.then((module) => setTranslations(module.default))
			.catch((error) => setError('Translation file not found:', error))
		getProfile()
	}, [])

	const getProfile = async () => {
		try {
			const response = await axiosInstance.get(`users/profile/${getUserId()}`)
			setProfile(response.data)
		} catch (err) {
			console.log(err)
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
			const response = await axiosInstance.put(`users/edit/${getUserId()}`, profile)
			if (response.status !== 200) {
				throw new Error(response.data.error)
			}
			navigate('/user/profile')
		} catch (err) {
			setError(err.error)
		}
	}

	return (
		<main className="edit-profile__page">
			<h1>{translate('Edit my profile')}</h1>

			<form
				className="edit-profile__form"
				onSubmit={handleSubmit}
			>
				<div className="edit-profile__form-group">
					<label htmlFor="username">{translate('Username:')}</label>
					<input
						type="text"
						name="username"
						id="username"
						value={profile.username}
						onChange={handleChange}
					/>
				</div>

				<div className="edit-profile__form-group">
					<label htmlFor="email">{translate('Email:')}</label>
					<input
						type="email"
						name="email"
						id="email"
						value={profile.email}
						onChange={handleChange}
					/>
				</div>

				<div className="edit-profile__form-group">
					<label htmlFor="password">{translate('Password:')}</label>
					<input
						type="password"
						name="password"
						id="password"
						onChange={handleChange}
					/>
				</div>

				<Button type="submit">{translate('Save changes')}</Button>
				{error && <p className="error-msg">{error}</p>}
			</form>
		</main>
	)
}

export default EditProfile
