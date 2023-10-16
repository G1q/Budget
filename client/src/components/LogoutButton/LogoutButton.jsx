import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../Button/Button'

const LogoutButton = () => {
	const { setAuthToken } = useAuth()
	const navigate = useNavigate()

	const handleClick = () => {
		localStorage.removeItem('token')
		setAuthToken(null)
		navigate('/login')
	}

	return (
		<Button
			onClick={handleClick}
			size="small"
		>
			Logout
		</Button>
	)
}

export default LogoutButton
