import './DeleteButton.css'
import { MdDelete } from 'react-icons/md'

const DeleteButton = ({ onClick }) => {
	return (
		<button
			className="data-table__delete-btn"
			onClick={onClick}
		>
			<MdDelete />
		</button>
	)
}

export default DeleteButton
