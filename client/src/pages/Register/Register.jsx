import './Register.css'

import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'

const Register = () => {
	const { isLoggedIn } = useAuth()
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await axios.post('http://localhost:3002/api/users/register', { username, email, password })
			if (response.status === 201) {
				navigate('/login')
			} else {
				setError(response.data.error || 'Registration failed')
			}
		} catch (error) {
			setError(error.response.data.error)
		}
	}

	return !isLoggedIn() ? (
		<div className="register-container">
			<h2>Register</h2>
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
				<button type="submit">Register</button>
			</form>
			<p>
				Do you have an account? <Link to="/login">Login</Link>
			</p>
		</div>
	) : (
		<Navigate to="/" />
	)
}

export default Register
