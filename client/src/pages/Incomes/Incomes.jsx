import './Incomes.css'
import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import { openDialog, clearForm, closeDialog } from '../../utilities/popup'
import { formatDate } from '../../utilities/formatDates'

const Incomes = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [incomes, setIncomes] = useState([])
	const [sourceTitle, setSourceTitle] = useState('')
	const [sourceError, setSourceError] = useState('')

	const getIncomes = async () => {
		try {
			const response = await axiosInstance(`incomes/${getUserId()}`)
			setIncomes(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getIncomes()
	}, [])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this income?')

		if (confirmDelete) {
			try {
				const response = await axiosInstance.delete(`incomes/${id}`)
				getIncomes()
			} catch (error) {
				console.log(error)
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
			const response = await axiosInstance.post('incomes/source', source)
			console.log(response)
			if (response.status === 201) {
				setSourceError('')
				clearForm()
				navigate('/incomes')
			} else {
				setSourceError(response.data.error || 'Registration failed')
			}
		} catch (error) {
			setSourceError(error.response.data.error)
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Incomes</h1>
			<div className="buttons-group">
				<Link
					to="./create"
					className="create-btn"
				>
					Create income
				</Link>
				<button
					className="create-btn popup-btn"
					id="create-source__btn"
					onClick={openDialog}
				>
					Create new source
				</button>
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
					<button>Create source</button>
					<p className="error-msg">{sourceError}</p>
				</form>
			</dialog>

			{incomes.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Source</th>
							<th>Budget</th>
							<th>Amount</th>
							<th>Edit income</th>
							<th>Delete income</th>
						</tr>
					</thead>
					<tbody>
						{incomes.map((income) => (
							<tr key={income._id}>
								<td>{formatDate(new Date(income.date))}</td>
								<td>{income.source.title}</td>
								<td>{income.budget.title}</td>
								<td>{income.amount}</td>
								<td>
									<Link
										className="edit-btn"
										to={`/incomes/edit/${income._id}`}
									>
										Edit
									</Link>
								</td>
								<td>
									<button
										className="delete-btn"
										onClick={() => handleDelete(income._id)}
									>
										&times;
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>You don't have any incomes!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Incomes
