import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoleRoute from './components/ProtectedRoute/ProtectedRoleRoute'
import MainLayout from './layouts/MainLayout'
import UserLayout from './layouts/UserLayout'

import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import Homepage from './pages/Homepage/Homepage'

import Users from './pages/Admin/Users/Users'
import CreateUser from './pages/Admin/Users/CreateUser/'
import EditUser from './pages/Admin/Users/EditUser/'
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard'
import NotFound from './pages/NotFound/NotFound'

import Budgets from './pages/Budgets/Budgets'
import CreateBudget from './pages/Budgets/CreateBudget'
import EditBudget from './pages/Budgets/EditBudget'
import LogBudget from './pages/Budgets/LogBudget'

import Incomes from './pages/Incomes/Incomes'
import EditIncome from './pages/Incomes/EditIncome'
import CreateIncome from './pages/Incomes/CreateIncome'

import Categories from './pages/Categories/Categories'
import EditCategory from './pages/Categories/EditCategory'

import Expenses from './pages/Expenses/Expenses'
import EditExpense from './pages/Expenses/EditExpense'
import CreateExpense from './pages/Expenses/CreateExpense'
import PayDebt from './pages/Expenses/PayDebt'

import Transfers from './pages/Transfers/Transfers'
import CreateTransfer from './pages/Transfers/CreateTransfer'
import EditTransfer from './pages/Transfers/EditTransfer'

import Sources from './pages/Sources/Sources'
import EditSource from './pages/Sources/EditSource'

import Debts from './pages/Debts/Debts'
import EditDebt from './pages/Debts/EditDebt'
import CreateDebt from './pages/Debts/CreateDebt'

import Transactions from './pages/Transactions/Transactions'

import UserDashboard from './pages/User/UserDashboard'
import UserProfile from './pages/User/UserProfile'
import EditProfile from './pages/User/EditProfile'
import UserSettings from './pages/User/UserSettings'

const App = () => {
	return (
		<AuthProvider>
			<Routes>
				<Route
					path="/"
					element={<MainLayout />}
				>
					<Route
						index
						element={<Homepage />}
					/>

					<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
						<Route
							path="/user"
							element={<UserLayout />}
						>
							<Route
								index
								element={<UserDashboard />}
							/>
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
							<Route path="/user/categories">
								<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
									<Route
										index
										element={<Categories />}
									/>
								</Route>

								<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
									<Route
										path="/user/categories/edit/"
										element={<EditCategory />}
									/>
								</Route>
							</Route>
							<Route path="/user/sources">
								<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
									<Route
										index
										element={<Sources />}
									/>
								</Route>

								<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
									<Route
										path="/user/sources/edit/"
										element={<EditSource />}
									/>
								</Route>
							</Route>

							<Route path="/user/transfers">
								<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
									<Route
										index
										element={<Transfers />}
									/>
								</Route>

								<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
									<Route
										path="/user/transfers/create"
										element={<CreateTransfer />}
									/>
								</Route>

								<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
									<Route
										path="/user/transfers/edit/"
										element={<EditTransfer />}
									/>
								</Route>
							</Route>
							<Route path="/user/settings">
								<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
									<Route
										index
										element={<UserSettings />}
									/>
								</Route>
							</Route>
						</Route>
					</Route>

					<Route path="/admin">
						<Route element={<ProtectedRoleRoute requiredRole={['admin', 'superadmin']} />}>
							<Route
								index
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
								path="/admin/users/edit/"
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
								path="/budgets/edit/"
								element={<EditBudget />}
							/>
						</Route>

						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								path="/budgets/log/"
								element={<LogBudget />}
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
								path="/incomes/edit/"
								element={<EditIncome />}
							/>
						</Route>
					</Route>

					<Route path="/expenses">
						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								index
								element={<Expenses />}
							/>
						</Route>

						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								path="/expenses/create"
								element={<CreateExpense />}
							/>
						</Route>

						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								path="/expenses/edit/"
								element={<EditExpense />}
							/>
						</Route>

						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								path="/expenses/paydebt"
								element={<PayDebt />}
							/>
						</Route>
					</Route>

					<Route path="/debts">
						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								index
								element={<Debts />}
							/>
						</Route>

						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								path="/debts/create"
								element={<CreateDebt />}
							/>
						</Route>

						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								path="/debts/edit/"
								element={<EditDebt />}
							/>
						</Route>
					</Route>

					<Route path="/transactions">
						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								index
								element={<Transactions />}
							/>
						</Route>
					</Route>

					<Route
						path="*"
						element={<NotFound />}
					/>
				</Route>
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
