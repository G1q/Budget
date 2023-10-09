import { Link } from 'react-router-dom'
import { FaHistory } from 'react-icons/fa'

const LogButton = ({ to }) => {
	return (
		<Link
			className="log-btn"
			to={to}
		>
			<FaHistory />
		</Link>
	)
}

export default LogButton
