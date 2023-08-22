import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoleRoute from './components/ProtectedRoute/ProtectedRoleRoute'
import Homepage from './pages/Homepage/Homepage'
import UserProfile from './pages/User/UserProfile/UserProfile'
import EditProfile from './pages/User/EditProfile/EditProfile'
import Users from './pages/Admin/Users/Users'
import CreateUser from './pages/Admin/Users/CreateUser/CreateUser'
import EditUser from './pages/Admin/Users/EditUser/EditUser'

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

				<Route path="/user">
					<Route
						path="/user/profile"
						element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}
					>
						<Route
							path="/user/profile"
							element={<UserProfile />}
						/>
					</Route>

					<Route
						path="/user/edit"
						element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}
					>
						<Route
							path="/user/edit"
							element={<EditProfile />}
						/>
					</Route>
				</Route>

				<Route path="/admin">
					<Route
						path="/admin/users"
						element={<ProtectedRoleRoute requiredRole={['admin', 'superadmin']} />}
					>
						<Route
							path="/admin/users"
							element={<Users />}
						/>
					</Route>

					<Route
						path="/admin/users/create"
						element={<ProtectedRoleRoute requiredRole={['admin', 'superadmin']} />}
					>
						<Route
							path="/admin/users/create"
							element={<CreateUser />}
						/>
					</Route>

					<Route
						path="/admin/users/edit/:id"
						element={<ProtectedRoleRoute requiredRole={['admin', 'superadmin']} />}
					>
						<Route
							path="/admin/users/edit/:id"
							element={<EditUser />}
						/>
					</Route>
				</Route>
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
