import './EditProfile.css'
import { useAuth } from '../../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const EditProfile = () => {
	const { getUserId } = useAuth()
	const [profile, setProfile] = useState({ username: '', email: '' })
	const [error, setError] = useState(null)

	const navigate = useNavigate()

	useEffect(() => {
		const getProfile = async () => {
			try {
				const response = await axios.get(`http://localhost:3002/api/users/profile/${getUserId()}`)
				setProfile(response.data)
			} catch (err) {
				console.log(err)
			}
		}

		getProfile()
	}, [])

	const handleChange = (e) => {
		setProfile((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await axios.put(`http://localhost:3002/api/users/edit/${getUserId()}`, profile)
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
			<h1>My profile</h1>

			<form className="edit-profile__form">
				<div className="edit-profile__form-group">
					<label htmlFor="username">Username:</label>
					<input
						type="text"
						name="username"
						id="username"
						value={profile.username}
						onChange={handleChange}
					/>
				</div>

				<div className="edit-profile__form-group">
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						name="email"
						id="email"
						value={profile.email}
						onChange={handleChange}
					/>
				</div>

				<button onClick={handleSubmit}>Save changes</button>
				{error && <p className="error-msg">{error}</p>}
			</form>
		</main>
	)
}

export default EditProfile
