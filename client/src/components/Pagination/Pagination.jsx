import { useState } from 'react'
import './Pagination.css'

const Pagination = ({ itemsPerPage, list }) => {
	const [startItem, setStartItem] = useState(0)
	const [endItem, setEndItem] = useState(itemsPerPage)

	const handleNextButton = () => {
		setStartItem((prev) => prev + itemsPerPage)
		setEndItem((prev) => prev + itemsPerPage)
	}

	const handlePrevButton = () => {
		setStartItem((prev) => prev - itemsPerPage)
		setEndItem((prev) => prev - itemsPerPage)
	}

	return (
		<div>
			{startItem > 0 && (
				<button
					type="button"
					onClick={handlePrevButton}
				>
					Prev
				</button>
			)}
			{endItem < list.length && (
				<button
					type="button"
					onClick={handleNextButton}
				>
					Next
				</button>
			)}
			<p>
				{Math.ceil(endItem / itemsPerPage)} / {Math.ceil(list.length / itemsPerPage)} pages
			</p>
		</div>
	)
}

export default Pagination
