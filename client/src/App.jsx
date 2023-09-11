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
import Categories from './pages/Categories/Categories'
import EditCategory from './pages/Categories/EditCategory/EditCategory'
import EditExpense from './pages/Expenses/EditExpense/EditExpense'
import CreateExpense from './pages/Expenses/CreateExpense/CreateExpense'
import Expenses from './pages/Expenses/Expenses'
import MainLayout from './layouts/MainLayout'
import Transfers from './pages/Transfers/Transfers'
import CreateTransfer from './pages/Transfers/CreateTransfer/CreateTransfer'
import EditTransfer from './pages/Transfers/EditTransfer/EditTransfer'
import Sources from './pages/Sources/Sources'
import EditSource from './pages/Sources/EditSource/EditSource'
import Debts from './pages/Debts/Debts'
import EditDebt from './pages/Debts/EditDebt/EditDebt'
import CreateDebt from './pages/Debts/CreateDebt/CreateDebt'
import Transactions from './pages/Transactions/Transactions'
import PayDebt from './pages/Expenses/PayDebt/PayDebt'

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

					<Route path="/categories">
						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								index
								element={<Categories />}
							/>
						</Route>

						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								path="/categories/edit/:id"
								element={<EditCategory />}
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
								path="/expenses/edit/:id"
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

					<Route path="/transfers">
						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								index
								element={<Transfers />}
							/>
						</Route>

						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								path="/transfers/create"
								element={<CreateTransfer />}
							/>
						</Route>

						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								path="/transfers/edit/:id"
								element={<EditTransfer />}
							/>
						</Route>
					</Route>

					<Route path="/sources">
						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								index
								element={<Sources />}
							/>
						</Route>

						<Route element={<ProtectedRoleRoute requiredRole={['user', 'admin', 'superadmin']} />}>
							<Route
								path="/sources/edit/:id"
								element={<EditSource />}
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
								path="/debts/edit/:id"
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
