import './Sources.css'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import { openDialog, clearForm, closeDialog } from '../../utilities/popup'
import Button from '../../components/Button/Button'

const Sources = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [sources, setSources] = useState([])
	const [sourceTitle, setSourceTitle] = useState('')
	const [error, setError] = useState(null)

	const navigate = useNavigate()

	const getSources = async () => {
		try {
			const response = await axiosInstance(`incomes/source/${getUserId()}`)
			setSources(response.data)
		} catch (error) {
			setError(error.message)
		}
	}

	useEffect(() => {
		getSources()
	}, [])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this source?')

		if (confirmDelete) {
			try {
				const source = await axiosInstance.get(`incomes/source/view/${id}`)

				// Delete source
				await axiosInstance.delete(`incomes/source/${id}`)

				// Refresh sources list
				getSources()
			} catch (error) {
				setError(error.response.data.error)
			}
		}
	}

	const handleCreateSource = async (e) => {
		e.preventDefault()
		try {
			const source = {
				title: sourceTitle,
				user: getUserId(),
			}

			await axiosInstance.post('incomes/source', source)
			getSources()
			setError(null)
			clearForm()
			navigate('/user/sources')
		} catch (error) {
			setError(error.message)
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Sources</h1>
			<div className="buttons-group">
				<Button
					className="popup-btn"
					id="create-source__btn"
					onClick={openDialog}
				>
					Create new source
				</Button>
			</div>

			<dialog
				className="popup-dialog"
				id="create-source-dialog"
			>
				<h2 className="popup-dialog__title">Create new source</h2>
				<button
					className="popup-close-btn"
					onClick={closeDialog}
				>
					&times;
				</button>
				<form
					className="popup-dialog__form"
					onSubmit={handleCreateSource}
				>
					<label htmlFor="title">Title</label>
					<input
						type="text"
						name="title"
						id="title"
						onChange={(e) => setSourceTitle(e.target.value)}
					/>
					<Button type="submit">Create source</Button>
					<p className="error-msg">{error}</p>
				</form>
			</dialog>

			{error && <p className="error-msg transaction__error-msg">{error}</p>}
			{sources.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>Source</th>
							<th>Edit source</th>
							<th>Delete source</th>
						</tr>
					</thead>
					<tbody>
						{sources.map((source) => (
							<tr key={source._id}>
								<td>{source.title}</td>
								<td>
									<Link
										className="edit-btn"
										to={`/user/sources/edit/${source._id}`}
									>
										Edit
									</Link>
								</td>
								<td>
									<button
										className="delete-btn"
										onClick={() => handleDelete(source._id)}
									>
										&times;
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>You don't have any sources!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Sources
