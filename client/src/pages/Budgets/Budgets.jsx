import { Link, Navigate } from 'react-router-dom'
import './Budgets.css'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'

const Budgets = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [budgets, setBudgets] = useState([])

	const getBudgets = async () => {
		try {
			const response = await axiosInstance(`/budgets/${getUserId()}`)
			setBudgets(response.data)
		} catch (error) {
			console.log(error)
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
				getBudgets()
			} catch (error) {
				console.log(error)
			}
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Budgets</h1>
			<Link
				to="./create"
				className="create-btn"
			>
				Create budget
			</Link>
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
								<td>{`${budget.targetAmount} ${budget.currency}`}</td>
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
