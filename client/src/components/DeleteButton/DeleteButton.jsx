import React from 'react'
import { MdDelete } from 'react-icons/md'

const DeleteButton = ({ onClick }) => {
	return (
		<button
			className="delete-btn"
			onClick={onClick}
		>
			<MdDelete />
		</button>
	)
}

export default DeleteButton
