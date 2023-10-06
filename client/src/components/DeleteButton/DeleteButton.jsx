import React from 'react'

const DeleteButton = ({ onClick }) => {
	return (
		<button
			className="delete-btn"
			onClick={onClick}
		>
			&times;
		</button>
	)
}

export default DeleteButton
