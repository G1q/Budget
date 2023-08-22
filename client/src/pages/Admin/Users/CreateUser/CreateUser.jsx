import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axiosInstance from '../../../../utilities/axiosconfig'

// Import style
import './CreateUser.css'

const CreateUser = () => {
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [role, setRole] = useState('user')
	const [error, setError] = useState('')

	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await axiosInstance.post('admin/users/register', { username, email, password, role })
			if (response.status === 201) {
				navigate('/admin/users')
			} else {
				setError(response.data.error || 'Registration failed')
			}
		} catch (error) {
			setError(error.response.data.error)
		}
	}

	return (
		<main className="admin-page">
			<h1 className="admin-page__main-title">Create new user</h1>
			{error && <p className="error-message">{error}</p>}
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						id="username"
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="role">Role</label>
					<select
						name="role"
						id="role"
						required
						onChange={(e) => setRole(e.target.value)}
					>
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</select>
				</div>
				<button type="submit">Create</button>
			</form>
		</main>
	)
}

export default CreateUser
