import { Link } from 'react-router-dom'
import '../admin-pages.css'

const AdminDashboard = () => {
	return (
		<main className="admin-page">
			<h1 className="admin-page__title">Admin dashboard</h1>
			<nav className="admin-page__nav">
				<ul className="admin-page__nav-list">
					<li className="admin-page__nav-item">
						<Link
							to="./users"
							className="admin-page__nav-link"
						>
							Users
						</Link>
					</li>
				</ul>
			</nav>
		</main>
	)
}

export default AdminDashboard
