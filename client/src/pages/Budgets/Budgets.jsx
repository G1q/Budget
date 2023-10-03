import { Link, Navigate } from 'react-router-dom'
import './Budgets.css'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import TdMeter from '../../components/TdMeter/TdMeter'
import { amountWithDecimals } from '../../utilities/format'
import ButtonLink from '../../components/ButtonLink/ButtonLink'

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
				<ButtonLink to="./create">Create budget</ButtonLink>
				<ButtonLink to="/user/transfers/create">Transfer between budgets</ButtonLink>
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
								<td>{amountWithDecimals(budget.startAmount, budget.currency)}</td>
								<td>{amountWithDecimals(budget.currentAmount, budget.currency)}</td>
								<TdMeter
									amount={budget.currentAmount}
									target={budget.targetAmount}
									currency={budget.currency}
								/>
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
