import './Login.css'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await axios.post('http://localhost:3002/api/users/login', { email, password })
			if (response.status === 200) {
				navigate('/')
			} else {
				setError(response.data.error || 'Login failed')
			}
		} catch (error) {
			setError(error.response.data.error)
		}
	}

	return (
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
	)
}

export default Login
