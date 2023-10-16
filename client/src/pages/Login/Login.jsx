import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utilities/axiosconfig'
import Button from '../../components/Button/Button'
import StatusMessage from '../../components/StatusMessage/StatusMessage'

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
			localStorage.setItem('token', response.data.token)
			navigate(0)
		} catch (error) {
			error.response ? setError(error.response.data.message) : setError(error.message)
		}
	}

	return !isLoggedIn() ? (
		<div className="form-container">
			<h2>Login</h2>
			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}
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
				<Button type="submit">Login</Button>
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
