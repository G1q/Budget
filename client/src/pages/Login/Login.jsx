import './Login.css'

import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utilities/axiosconfig'

const Login = () => {
	const { isLoggedIn } = useAuth()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await axiosInstance.post('users/login', { email, password })
			if (response.status === 200) {
				localStorage.setItem('token', response.data.token)
				navigate(0)
			} else {
				setError(response.data.error || 'Login failed')
			}
		} catch (error) {
			setError(error.response.data.error)
		}
	}

	return !isLoggedIn() ? (
		<div className="login-container">
			<h2>Login</h2>
			{error && <p className="error-message">{error}</p>}
			<form onSubmit={handleSubmit}>
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
				<button type="submit">Login</button>
			</form>
			<p>
				Don't have an account? <Link to="/register">Register</Link>
			</p>
		</div>
	) : (
		<Navigate to="/" />
	)
}

export default Login
