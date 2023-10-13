import { useNavigate } from 'react-router-dom'
import './UserProfile.css'
import { useAuth } from '../../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utilities/axiosconfig'
import ButtonLink from '../../../components/ButtonLink/ButtonLink'
import Button from '../../../components/Button/Button'

const UserProfile = () => {
	const { getUserId, setAuthToken, getUserSettings } = useAuth()
	const [profile, setProfile] = useState({})
	const [translations, setTranslations] = useState(null)
	const [error, setError] = useState(null)

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

	const handleDeleteProfile = async () => {
		const confirmDelete = window.confirm(translate('Are you sure do you want delete your account?'))

		if (confirmDelete) {
			try {
				await axiosInstance.delete(`users/delete/${getUserId()}`)
				setAuthToken(null)
				localStorage.removeItem('token')
				navigate('/login')
			} catch (error) {
				console.log(error)
			}
		}
	}

	return (
		<section className="user__profile">
			<h1>{translate('My profile')}</h1>
			<div className="profile__info">
				<p>
					{translate('Username:')} <strong>{profile.username}</strong>
				</p>
				<p>
					{translate('Email:')} <strong>{profile.email}</strong>
				</p>
			</div>
			<div className="profile__actions">
				<ButtonLink to="/user/edit">{translate('Edit profile')}</ButtonLink>
				<Button
					datatype="danger"
					onClick={handleDeleteProfile}
				>
					{translate('Delete profile')}
				</Button>
			</div>
		</section>
	)
}

export default UserProfile
