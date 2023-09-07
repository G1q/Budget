import { Link } from 'react-router-dom'
import LogoutButton from '../LogoutButton/LogoutButton'
import './Header.css'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
	const { getUserName, isLoggedIn } = useAuth()

	return (
		<header>
			<nav className="primary__navigation">
				<div className="logo">
					{/* <img
						src="#"
						alt="logo"
					/> */}
					<Link to="/">Budget APP</Link>
				</div>

				<ul className="primary__navigation-list">
					{isLoggedIn() && (
						<>
							<li className="primary__navigation-item">
								<Link
									to="/budgets"
									className="primary__navigation-link"
								>
									Budgets
								</Link>
							</li>

							<li className="primary__navigation-item">
								<Link
									to="/incomes"
									className="primary__navigation-link"
								>
									Incomes
								</Link>
							</li>

							<li className="primary__navigation-item">
								<Link
									to="/expenses"
									className="primary__navigation-link"
								>
									Expenses
								</Link>
							</li>

							<li className="primary__navigation-item">
								<Link
									to="/categories"
									className="primary__navigation-link"
								>
									Categories
								</Link>
							</li>

							<li className="primary__navigation-item">
								<Link
									to="/transfers"
									className="primary__navigation-link"
								>
									Transfers
								</Link>
							</li>

							<li className="primary__navigation-item">
								<Link
									to="/sources"
									className="primary__navigation-link"
								>
									Sources
								</Link>
							</li>

							<li className="primary__navigation-item">
								<Link
									to="/debts"
									className="primary__navigation-link"
								>
									Debts
								</Link>
							</li>
						</>
					)}
				</ul>
				{isLoggedIn() ? (
					<div className="primary__navigation-group">
						<p>Hello, {getUserName()}</p>
						<LogoutButton />
					</div>
				) : (
					<div className="primary__navigation-group">
						<Link
							to="/login"
							className="primary__navigation-link login-btn"
						>
							Login
						</Link>
					</div>
				)}
			</nav>
		</header>
	)
}

export default Header
