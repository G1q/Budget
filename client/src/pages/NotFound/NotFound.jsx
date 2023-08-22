import { Link } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
	return (
		<main>
			<h1>Page not found</h1>
			<p>
				Go back to <Link to="/">Homepage</Link>
			</p>
		</main>
	)
}

export default NotFound
