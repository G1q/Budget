import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoleRoute from './components/ProtectedRoute/ProtectedRoleRoute'
import Homepage from './pages/Homepage/Homepage'

const App = () => {
	return (
		<AuthProvider>
			<Routes>
				<Route
					path="/"
					exact
					element={<Homepage />}
				/>

				<Route
					path="/register"
					element={<Register />}
				/>

				<Route
					path="/login"
					element={<Login />}
				/>
			</Routes>
		</AuthProvider>
	)
}

export default App

{
	// Ex: protected route
	/* <Route
					path="/register"
					element={<ProtectedRoleRoute requiredRole={['user', 'admin']} />}
				>
					<Route
						path="/register"
						element={<Register />}
					/>
				</Route> */
}
