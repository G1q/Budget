import './Homepage.css'
import LogoutButton from '../../components/LogoutButton/LogoutButton'
import { Link } from 'react-router-dom'

const Homepage = () => {
	return (
		<div>
			<h1>Homepage</h1>
			<div>
				<Link
					to="/budgets"
					className="homepage-link"
				>
					Budgets
				</Link>

				<Link
					to="/incomes"
					className="homepage-link"
				>
					Incomes
				</Link>

				<Link
					to="/categories"
					className="homepage-link"
				>
					Categories
				</Link>

				<Link
					to="/expenses"
					className="homepage-link"
				>
					Expenses
				</Link>
			</div>
			{/* TODO: include button in header, now it's just for test */}
			<LogoutButton />
		</div>
	)
}

export default Homepage
