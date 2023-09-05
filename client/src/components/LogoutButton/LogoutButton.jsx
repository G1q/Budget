import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const LogoutButton = () => {
	const { setAuthToken } = useAuth()
	const navigate = useNavigate()

	const handleLogout = () => {
		localStorage.removeItem('token')
		setAuthToken(null)
		navigate('/login')
	}

	return (
		<button
			className="logout-btn primary__navigation-btn"
			onClick={handleLogout}
		>
			Logout
		</button>
	)
}

export default LogoutButton
