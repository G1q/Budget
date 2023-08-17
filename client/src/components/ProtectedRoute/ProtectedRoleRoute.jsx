import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ProtectedRoleRoute = ({ Component: component, requiredRole, ...rest }) => {
	const { isLoggedIn, getUserRole } = useAuth()

	return isLoggedIn() && requiredRole.includes(getUserRole()) ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoleRoute
