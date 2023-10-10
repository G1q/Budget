import { Link } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'

const EditButton = ({ state }) => {
	return (
		<Link
			className="edit-btn"
			to="./edit"
			state={state}
		>
			<FaEdit />
		</Link>
	)
}

export default EditButton
