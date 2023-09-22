import './UserNav.css'
import { Link } from 'react-router-dom'

const UserNav = () => {
	return (
		<nav className="user__navigation">
			<ul className="user__navigation--list">
				<li className="user__navigation--item">
					<Link
						to="./profile"
						className="user__navigation--link"
					>
						My profile
					</Link>
				</li>

				<li className="user__navigation--item">
					<Link
						to="./categories"
						className="user__navigation--link"
					>
						Categories
					</Link>
				</li>

				<li className="user__navigation--item">
					<Link
						to="./sources"
						className="user__navigation--link"
					>
						Sources
					</Link>
				</li>

				<li className="user__navigation--item">
					<Link
						to="./transfers"
						className="user__navigation--link"
					>
						Transfers
					</Link>
				</li>

				<li className="user__navigation--item">
					<Link
						to="./settings"
						className="user__navigation--link"
					>
						Settings
					</Link>
				</li>
			</ul>
		</nav>
	)
}

export default UserNav
