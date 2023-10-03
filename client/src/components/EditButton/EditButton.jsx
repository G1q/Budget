import { Link } from 'react-router-dom'

const EditButton = ({ to }) => {
	return (
		<Link
			className="edit-btn"
			to={to}
		>
			Edit
		</Link>
	)
}

export default EditButton
