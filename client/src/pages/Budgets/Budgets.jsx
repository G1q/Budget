import { Link, Navigate } from 'react-router-dom'
import './Budgets.css'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'

const Budgets = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [budgets, setBudgets] = useState([])
	const [error, setError] = useState(null)
	const [success, setSucces] = useState(null)

	const getBudgets = async () => {
		try {
			const response = await axiosInstance(`/budgets/${getUserId()}`)
			setBudgets(response.data)
			setError(null)
		} catch (error) {
			setError(error)
		}
	}

	useEffect(() => {
		getBudgets()
	}, [])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this budget?')

		if (confirmDelete) {
			try {
				const response = await axiosInstance.delete(`budgets/${id}`)
				setError(null)
				setSucces(response.data.message)
				getBudgets()
			} catch (error) {
				setError(error.response.data.error)
			}
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Budgets</h1>

			<div className="buttons-group">
				<Link
					to="./create"
					className="create-btn"
				>
					Create budget
				</Link>
				<Link
					to="/transfers/create"
					className="create-btn"
				>
					Transfer between budgets
				</Link>
			</div>
			{success && <p className="error-msg transaction__error-msg">{success}</p>}
			{error && <p className="error-msg transaction__error-msg">{error}</p>}
			{budgets.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>Title</th>
							<th>Start amount</th>
							<th>Current amount</th>
							<th>Target amount</th>
							<th>Edit budget</th>
							<th>Delete budget</th>
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

export default Budgets
