import { Link } from 'react-router-dom'

const EditButton = ({ state }) => {
	return (
		<Link
			className="edit-btn"
			to="./edit"
			state={state}
		>
			Edit
		</Link>
	)
}

export default EditButton
