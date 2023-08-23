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
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard'
import NotFound from './pages/NotFound/NotFound'
import Budgets from './pages/Budgets/Budgets'
import CreateBudget from './pages/Budgets/CreateBudget/CreateBudget'
import EditBudget from './pages/Budgets/EditBudget/EditBudget'
import Incomes from './pages/Incomes/Incomes'
import EditIncome from './pages/Incomes/EditIncome/EditIncome'
import CreateIncome from './pages/Incomes/CreateIncome/CreateIncome'

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
					<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
						<Route
							path="/user/profile"
							element={<UserProfile />}
						/>
					</Route>

					<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
						<Route
							path="/user/edit"
							element={<EditProfile />}
						/>
					</Route>
				</Route>

				<Route path="/admin">
					<Route element={<ProtectedRoleRoute requiredRole={['admin', 'superadmin']} />}>
						<Route
							path="/admin/"
							element={<AdminDashboard />}
						/>
					</Route>

					<Route element={<ProtectedRoleRoute requiredRole={['admin', 'superadmin']} />}>
						<Route
							path="/admin/users"
							element={<Users />}
						/>
					</Route>

					<Route element={<ProtectedRoleRoute requiredRole={['admin', 'superadmin']} />}>
						<Route
							path="/admin/users/create"
							element={<CreateUser />}
						/>
					</Route>

					<Route element={<ProtectedRoleRoute requiredRole={['admin', 'superadmin']} />}>
						<Route
							path="/admin/users/edit/:id"
							element={<EditUser />}
						/>
					</Route>
				</Route>

				<Route path="/budgets">
					<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
						<Route
							index
							element={<Budgets />}
						/>
					</Route>

					<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
						<Route
							path="/budgets/create"
							element={<CreateBudget />}
						/>
					</Route>

					<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
						<Route
							path="/budgets/edit/:id"
							element={<EditBudget />}
						/>
					</Route>
				</Route>

				<Route path="/incomes">
					<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
						<Route
							index
							element={<Incomes />}
						/>
					</Route>

					<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
						<Route
							path="/incomes/create"
							element={<CreateIncome />}
						/>
					</Route>

					<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
						<Route
							path="/incomes/edit/:id"
							element={<EditIncome />}
						/>
					</Route>
				</Route>

				<Route
					path="*"
					element={<NotFound />}
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
