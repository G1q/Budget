// Import dependencies
import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// Import custom components
import Button from '../../components/Button/Button'
import Dialog, { openDialog, closeDialog } from '../../components/Dialog/Dialog'
import StatusMessage from '../../components/StatusMessage/StatusMessage'
import DataTable from '../../components/DataTable/DataTable'
import EditButton from '../../components/EditButton/EditButton'
import DeleteButton from '../../components/DeleteButton/DeleteButton'
import Loading from '../../components/Loading/Loading'

// Import utilities
import axiosInstance from '../../utilities/axiosconfig'
import { fetchSources } from '../../utilities/fetchData'

const Sources = () => {
	const { getUserId, isLoggedIn, getUserSettings } = useAuth()
	const [sources, setSources] = useState([])
	const [sourceTitle, setSourceTitle] = useState('')
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)
	const [translations, setTranslations] = useState(null)
	const [isLoading, setLoading] = useState(true)

	const settings = getUserSettings()
	const translate = (key) => (translations ? translations[key] : key)

	useEffect(() => {
		import(`../../locales/languages/lang_${settings.language}.json`)
			.then((module) => setTranslations(module.default))
			.catch((error) => setError('Translation file not found:', error))
		fetchSources(getUserId())
			.then((responseData) => {
				setSources(responseData)
				setLoading(false)
			})
			.catch((error) => setError(error.response.data.message))
	}, [])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm(translate('Are you sure do you want delete this source?'))

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
		<section className="page__section">
			<h1 className="page__title">{translate('Sources')}</h1>

			<div className="header__actions">
				<div className="buttons-group">
					<Button
						onClick={openDialog}
						className="popup-btn"
					>
						{translate('Create new source')}
					</Button>
				</div>
			</div>

			<Dialog
				title={translate('Create new source')}
				textButton={translate('Create source')}
				onClick={closeDialog}
				onSubmit={handleSubmit}
			>
				<label htmlFor="title">{translate('Title')}</label>
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
			{isLoading ? (
				<Loading />
			) : sources.length > 0 ? (
				<DataTable cols={[translate('Source'), translate('Edit'), translate('Delete')]}>
					{sources.map((source) => (
						<tr key={source._id}>
							<td>{source.title}</td>
							<td>
								<EditButton state={{ id: source._id }} />
							</td>
							<td>
								<DeleteButton onClick={() => handleDelete(source._id)} />
							</td>
						</tr>
					))}
				</DataTable>
			) : (
				<p>{translate("You don't have any sources!")}</p>
			)}
		</section>
	) : (
		<Navigate to="/" />
	)
}

export default Sources
