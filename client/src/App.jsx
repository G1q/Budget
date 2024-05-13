import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

// Import custom components
import ProtectedRoleRoute from './components/ProtectedRoute/ProtectedRoleRoute'

// Import Layouts
import MainLayout from './layouts/MainLayout'
import UserLayout from './layouts/UserLayout'

// Import pages
import Homepage from './pages/Homepage/Homepage'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import NotFound from './pages/NotFound/NotFound'
import { Budgets, CreateBudget, EditBudget, LogBudget } from './pages/Budgets'
import { Categories, EditCategory } from './pages/Categories'
import { Debts, CreateDebt, EditDebt } from './pages/Debts'
import { Expenses, CreateExpense, EditExpense, PayDebt } from './pages/Expenses'
import { Incomes, CreateIncome, EditIncome } from './pages/Incomes'
import { Sources, EditSource } from './pages/Sources'
import { Transfers, CreateTransfer, EditTransfer } from './pages/Transfers'
import { UserDashboard, UserProfile, EditProfile, UserSettings } from './pages/User'
import { AdminDashboard, CreateUser, EditUser, Users } from './pages/Admin'

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
