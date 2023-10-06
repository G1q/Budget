import './DataTable.css'

const DataTable = ({ cols = [], children }) => {
	return (
		<table>
			<thead>
				<tr>
					{cols.map((col) => (
						<th key={col}>{col}</th>
					))}
				</tr>
			</thead>
			<tbody>{children}</tbody>
		</table>
	)
}

export default DataTable
