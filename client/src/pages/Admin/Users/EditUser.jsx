import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../utilities/axiosconfig'
import Button from '../../../components/Button/Button'

const EditUser = () => {
	const { state } = useLocation()
	const id = state.id
	const [user, setUser] = useState('')
	const [username, setUsername] = useState('')
	const [error, setError] = useState('')

	const navigate = useNavigate()

	const getUser = async () => {
		try {
			const response = await axiosInstance.get(`admin/users/${id}`)
			setUser(response.data)
			setUsername(response.data.username)
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		getUser()
	}, [])

	const handleChange = (e) => {
		setUser((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await axiosInstance.put(`admin/users/edit/${id}`, user)
			if (response.status === 200) {
				navigate('/admin/users/')
			} else {
				setError(response.data.error || 'Registration failed')
			}
		} catch (error) {
			setError(error.response.data.error)
		}
	}

	return (
		<main className="admin-page">
			<h1 className="admin-page__title">Edit user {username}</h1>
			<div className="form-container">
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="username">Username:</label>
						<input
							type="text"
							name="username"
							id="username"
							value={user.username}
							onChange={handleChange}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="email">Email:</label>
						<input
							type="email"
							name="email"
							id="email"
							value={user.email}
							onChange={handleChange}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="role">Role:</label>
						<select
							name="role"
							id="role"
							value={user.role}
							onChange={handleChange}
						>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password:</label>
						<input
							type="password"
							name="password"
							id="password"
							onChange={handleChange}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="active">Active:</label>
						<input
							type="checkbox"
							name="active"
							id="active"
							checked={user.active}
							onChange={(e) =>
								setUser((prev) => ({
									...prev,
									active: e.target.checked,
								}))
							}
						/>
					</div>

					<Button type="submit">Save changes</Button>
					{error && <p className="error-msg">{error}</p>}
				</form>
			</div>
		</main>
	)
}

export default EditUser
