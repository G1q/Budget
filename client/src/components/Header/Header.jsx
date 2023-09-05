import { Link } from 'react-router-dom'
import LogoutButton from '../LogoutButton/LogoutButton'
import './Header.css'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
	const { getUserName } = useAuth()

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
				</ul>
				<div className="primary__navigation-group">
					<p>Hello, {getUserName()}</p>
					<LogoutButton />
				</div>
			</nav>
		</header>
	)
}

export default Header
