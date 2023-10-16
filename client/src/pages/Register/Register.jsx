import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import Button from '../../components/Button/Button'
import StatusMessage from '../../components/StatusMessage/StatusMessage'

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
			await axiosInstance.post('users/register', { username, email, password })
			navigate('/login')
		} catch (error) {
			error.response ? setError(error.response.data.message) : setError(error.message)
		}
	}

	return !isLoggedIn() ? (
		<div className="form-container">
			<h2>Register</h2>
			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}
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
				<Button type="submit">Register</Button>
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
