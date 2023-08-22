import { Link, useNavigate } from 'react-router-dom'
import './UserProfile.css'
import { useAuth } from '../../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import axios from 'axios'

const UserProfile = () => {
	const { getUserId, setAuthToken } = useAuth()
	const [profile, setProfile] = useState({})

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

	const handleDeleteProfile = async () => {
		const confirmDelete = window.confirm('Are you sure do you want delete your account?')

		if (confirmDelete) {
			try {
				await axios.delete(`http://localhost:3002/api/users/delete/${getUserId()}`)
				setAuthToken(null)
				localStorage.removeItem('token')
				navigate('/login')
			} catch (error) {
				console.log(error)
			}
		}
	}

	return (
		<main className="profile__page">
			<h1>My profile</h1>

			<div className="profile__info">
				<p>
					Username: <strong>{profile.username}</strong>
				</p>
				<p>
					Email: <strong>{profile.email}</strong>
				</p>
				<p>
					Role: <strong>{profile.role}</strong>
				</p>
			</div>
			<div className="profile__actions">
				<Link to="/user/edit">Edit profile</Link>
				<button onClick={handleDeleteProfile}>Delete profile</button>
			</div>
		</main>
	)
}

export default UserProfile