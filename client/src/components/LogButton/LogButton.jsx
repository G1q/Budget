import { Link } from 'react-router-dom'
import { FaHistory } from 'react-icons/fa'

const LogButton = ({ state }) => {
	return (
		<Link
			className="log-btn"
			to="./log"
			state={state}
		>
			<FaHistory />
		</Link>
	)
}

export default LogButton
