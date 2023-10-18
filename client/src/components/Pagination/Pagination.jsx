import './Pagination.css'
import Button from '../Button/Button'

const Pagination = ({ startIndex, endIndex, dataArray, numberOfItemsPerPage, onClickPrev, onClickNext }) => {
	return (
		<div
			className="pagination"
			style={{ marginBlock: '.5rem' }}
		>
			{numberOfItemsPerPage < dataArray.length && (
				<>
					<Button
						onClick={onClickPrev}
						size="small"
						disabled={startIndex <= 0}
					>
						Prev
					</Button>

					<Button
						onClick={onClickNext}
						size="small"
						disabled={endIndex >= dataArray.length}
					>
						Next
					</Button>
				</>
			)}

			<p style={{ margin: 0, marginLeft: '0.25em', fontSize: '.875rem' }}>
				{Math.ceil(endIndex / numberOfItemsPerPage)} / {Math.ceil(dataArray.length / numberOfItemsPerPage)} pages
			</p>
		</div>
	)
}

export default Pagination

/* How to implement:
	1. import useState, useEffect from React and Pagination element to your page

	2. Set const ITEMS_PER_PAGE = number of elements you want to display

	3. Set default values: 	
		const [startItem, setStartItem] = useState(0)
		const [endItem, setEndItem] = useState(ITEMS_PER_PAGE)

	4. Put code below in your useEffect hook (only if you have SelectInterval component in page)
		setStartItem(0)
		setEndItem(ITEMS_PER_PAGE)

	5. Add handle functions for buttons: 
		const handleNextButton = () => {
			setStartItem((prev) => prev + ITEMS_PER_PAGE)
			setEndItem((prev) => prev + ITEMS_PER_PAGE)
		}

		const handlePrevButton = () => {
			setStartItem((prev) => prev - ITEMS_PER_PAGE)
			setEndItem((prev) => prev - ITEMS_PER_PAGE)
		}

	6. Use slice inside your table data array you want to show ITEMS_PER_PAGE elements:
		.slice(startItem, endItem)
		
	7. Add element to your page:
		<Pagination
			startIndex={startItem}
			endIndex={endItem}
			dataArray={array} 
			numberOfItemsPerPage={ITEMS_PER_PAGE}
			onClickNext={handleNextButton}
			onClickPrev={handlePrevButton}
		/>
*/
