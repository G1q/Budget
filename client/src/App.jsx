import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoleRoute from './components/ProtectedRoute/ProtectedRoleRoute'

const App = () => {
	return (
		<AuthProvider>
			<Routes>
				<Route
					path="/"
					exact
					element={<h1>Homepage</h1>}
				/>

				<Route
					path="/register"
					element={<ProtectedRoleRoute />}
					requiredRole="admin"
				>
					<Route
						path="/register"
						element={<Register />}
					/>
				</Route>

				<Route
					path="/login"
					element={<Login />}
				/>
			</Routes>
		</AuthProvider>
	)
}

export default App
