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
							<th>Amount</th>
						</tr>
					</thead>
					<tbody>
						{budgets.map((budget) => (
							<tr key={budget._id}>
								<td>{budget.title}</td>
								<td>{`${budget.amount} ${budget.currency}`}</td>
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
