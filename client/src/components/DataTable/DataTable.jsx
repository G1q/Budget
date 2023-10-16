import './DataTable.css'

const DataTable = ({ cols = [], children }) => {
	return (
		<table className="data-table">
			<thead className="data-table__header">
				<tr>
					{cols.map((col) => (
						<th key={col}>{col}</th>
					))}
				</tr>
			</thead>
			<tbody className="data-table__content">{children}</tbody>
		</table>
	)
}

export default DataTable
