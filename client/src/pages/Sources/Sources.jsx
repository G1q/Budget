// Import dependencies
import { Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// Import custom components
import Button from '../../components/Button/Button'
import Dialog, { openDialog, closeDialog } from '../../components/Dialog/Dialog'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import DataTable from '../../components/DataTable/DataTable'
import EditButton from '../../components/EditButton/EditButton'
import DeleteButton from '../../components/DeleteButton/DeleteButton'

// Import utilities
import axiosInstance from '../../utilities/axiosconfig'
import { fetchSources } from '../../utilities/fetchData'

// Import styling
import './Sources.css'

const Sources = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [sources, setSources] = useState([])
	const [sourceTitle, setSourceTitle] = useState('')
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)

	const navigate = useNavigate()

	useEffect(() => {
		fetchSources(getUserId())
			.then((responseData) => setSources(responseData))
			.catch((error) => setError(error.response.data.message))
	}, [])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this source?')

		if (confirmDelete) {
			try {
				const response = await axiosInstance.delete(`incomes/source/${id}`)
				setError(null)
				setSuccess(response.data.message)
				fetchSources(getUserId())
					.then((responseData) => setSources(responseData))
					.catch((error) => setError(error.response.data.message))
			} catch (error) {
				setSuccess(null)
				error.response ? setError(error.response.data.message) : setError(error.message)
			}
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const source = {
				title: sourceTitle,
				user: getUserId(),
			}

			const response = await axiosInstance.post('incomes/source', source)
			closeDialog()
			setError(null)
			setSuccess(response.data.message)
			fetchSources(getUserId())
				.then((responseData) => setSources(responseData))
				.catch((error) => setError(error.response.data.message))
		} catch (error) {
			setSuccess(null)
			error.response ? setError(error.response.data.message) : setError(error.message)
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Sources</h1>

			<div className="header__actions">
				<div className="buttons-group">
					<Button
						onClick={openDialog}
						className="popup-btn"
					>
						Create new source
					</Button>
				</div>
			</div>

			<Dialog
				title="Create new source"
				textButton="Create source"
				onClick={closeDialog}
				onSubmit={handleSubmit}
			>
				<label htmlFor="title">Title</label>
				<input
					type="text"
					name="title"
					id="title"
					onChange={(e) => setSourceTitle(e.target.value)}
				/>

				{error && (
					<StatusMessage
						type="error"
						message={error}
					/>
				)}
			</Dialog>

			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}
			{success && (
				<StatusMessage
					type="success"
					message={success}
				/>
			)}
			{sources.length > 0 ? (
				<DataTable cols={['Source', 'Edit source', 'Delete source']}>
					{sources.map((source) => (
						<tr key={source._id}>
							<td>{source.title}</td>
							<td>
								<EditButton to={`/user/sources/edit/${source._id}`} />
							</td>
							<td>
								<DeleteButton onClick={() => handleDelete(source._id)} />
							</td>
						</tr>
					))}
				</DataTable>
			) : (
				<p>You don't have any sources!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Sources
