import './Incomes.css'
import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import { openDialog, clearForm, closeDialog } from '../../utilities/popup'

const Incomes = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [budgets, setBudgets] = useState([])
	const [incomes, setIncomes] = useState([])
	const [sourceTitle, setSourceTitle] = useState('')
	const [sourceError, setSourceError] = useState('')

	const getBudgets = async () => {
		try {
			const response = await axiosInstance(`/budgets/${getUserId()}`)
			setBudgets(response.data)
			// const response = await axiosInstance(`/incomes/${getUserId()}`)
			// setIncomes(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getBudgets()
		// getIncomes()
	}, [])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this income?')

		if (confirmDelete) {
			try {
				const response = await axiosInstance.delete(`budgets/${id}`)
				getBudgets()
				// const response = await axiosInstance.delete(`incomes/${id}`)
				// getIncomes()
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

			{budgets.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Source</th>
							<th>to Budget</th>
							<th>Amount</th>
							<th>Edit income</th>
							<th>Delete income</th>
						</tr>
					</thead>
					<tbody>
						{budgets.map((budget) => (
							<tr key={budget._id}>
								<td>{budget.title}</td>
								<td>{`${budget.startAmount} ${budget.currency}`}</td>
								<td>{`${budget.currentAmount} ${budget.currency}`}</td>
								<td>{budget.targetAmount ? `${budget.targetAmount} ${budget.currency}` : '-'}</td>
								<td>
									<Link
										className="edit-btn"
										to={`/budgets/edit/${budget._id}`}
									>
										Edit
									</Link>
								</td>
								<td>
									<button
										className="delete-btn"
										onClick={() => handleDelete(budget._id)}
									>
										&times;
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>Please create your first budget to start!</p>
			)}
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Incomes
