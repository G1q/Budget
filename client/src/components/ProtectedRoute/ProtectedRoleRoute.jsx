import { Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ProtectedRoleRoute = ({ component: Component, requiredRole, ...rest }) => {
	const { user } = useAuth()

	return user && user.role === requiredRole ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoleRoute
