import './DataTable.css'

const DataTable = ({ cols = [], size, caption, children }) => {
	return (
		<table
			className="data-table"
			data-size={size}
		>
			{caption && <caption>{caption}</caption>}
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
