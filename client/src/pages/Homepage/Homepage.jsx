import './Homepage.css'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axiosInstance from '../../utilities/axiosconfig'
import Test from '../../components/Test'

const Homepage = () => {
	const { getUserId, isLoggedIn } = useAuth()
	const [budgetTotal, setBudgetTotal] = useState(0)
	const [error, setError] = useState(null)

	const getBudgetTotal = async () => {
		try {
			const response = await axiosInstance.get(`budgets/total/${getUserId()}`)
			setBudgetTotal(response.data.total)
			console.log(response)
		} catch {
			setError(error.message)
		}
	}

	useEffect(() => {
		getBudgetTotal()
	}, [])

	return (
		<main>
			<h1>Homepage</h1>
			<section className="summaries">
				{error && <p>{error}</p>}
				<div className="summaries__wrapper">
					<div className="summaries__card summaries__budget-total">
						<p>
							Budgets total: <span>{budgetTotal}</span>
						</p>
					</div>
				</div>
			</section>

			{/* Teste */}
			<Test />
		</main>
	)
}

export default Homepage
