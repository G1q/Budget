import './Pagination.css'
import Button from '../Button/Button'

const Pagination = ({ items = 10, startItem = 0, endItem = 10, dataArray = [] }) => {
	const [startItem, setStartItem] = useState(0)
	const [endItem, setEndItem] = useState(items)

	const handlePrevButton = () => {
		setStartItem((prev) => prev - items)
		setEndItem((prev) => prev - items)
	}

	const handleNextButton = () => {
		setStartItem((prev) => prev + items)
		setEndItem((prev) => prev + items)
	}

	return (
		<div>
			{startItem > 0 && <Button onClick={handlePrevButton}>Prev</Button>}
			{endItem < dataArray.length && <Button onClick={handleNextButton}>Next</Button>}
			<p>
				{Math.ceil(endItem / items)} / {Math.ceil(dataArray.length / items)} pages
			</p>
		</div>
	)
}

export default Pagination
