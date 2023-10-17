// Import dependencies
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

// Import custom components
import Button from '../../components/Button/Button'
import StatusMessage from '../../components/StatusMessage/StatusMessage'

// Import utilities
import axiosInstance from '../../utilities/axiosconfig'
import { fetchBudgets } from '../../utilities/fetchData'

const CreateTransfer = () => {
	const { getUserId, isLoggedIn, getUserSettings } = useAuth()
	const [inputs, setInputs] = useState({ user: getUserId() })
	const [budgets, setBudgets] = useState([])
	const [error, setError] = useState(null)
	const [translations, setTranslations] = useState(null)

	const navigate = useNavigate()

	const settings = getUserSettings()
	const translate = (key) => (translations ? translations[key] : key)

	useEffect(() => {
		import(`../../locales/languages/lang_${settings.language}.json`)
			.then((module) => setTranslations(module.default))
			.catch((error) => setError('Translation file not found:', error))
		fetchBudgets(getUserId())
			.then((responseData) => setBudgets(responseData))
			.catch((error) => setError(error.response.data.message))
	}, [])

	const handleChange = (e) => {
		if (e.target.id === 'sourceId') {
			setInputs((prev) => ({
				...prev,
				[e.target.name]: e.target.value,
				sourceTitle: e.target.selectedOptions[0].textContent,
			}))
		}
		if (e.target.id === 'budgetId') {
			setInputs((prev) => ({
				...prev,
				[e.target.name]: e.target.value,
				budgetTitle: e.target.selectedOptions[0].textContent,
			}))
		}
		setInputs((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			// Check if they are different budgets
			if (inputs.sourceId === inputs.budgetId) {
				throw new Error(translate("You can't transfer to same budget account!"))
			} else {
				// Change new budgets
				const sourceBudget = await axiosInstance.get(`/budgets/view/${inputs.sourceId}`)
				const destinationBudget = await axiosInstance.get(`/budgets/view/${inputs.budgetId}`)

				const newSourceAmount = Number(sourceBudget.data.currentAmount) - Number(inputs.amount)
				const newDestinationAmount = Number(destinationBudget.data.currentAmount) + Number(inputs.amount)

				const logsSource = sourceBudget.data.logs
				const logsDestination = destinationBudget.data.logs

				logsSource.push({
					date: Date.now(),
					type: 'transfer-source',
					currentAmount: newSourceAmount,
					modifiedAmount: inputs.amount,
				})

				logsDestination.push({
					date: Date.now(),
					type: 'transfer-destination',
					currentAmount: newDestinationAmount,
					modifiedAmount: inputs.amount,
				})

				if (newSourceAmount < 0) {
					throw new Error(translate("You don't have this amount in source budget!"))
				} else {
					await axiosInstance.put(`/budgets/${inputs.sourceId}`, { currentAmount: newSourceAmount, logs: logsSource })
					await axiosInstance.put(`/budgets/${inputs.budgetId}`, { currentAmount: newDestinationAmount, logs: logsDestination })
					await axiosInstance.post('transfers', inputs)
				}

				// Redirect
				navigate('/user/transfers')
			}
		} catch (error) {
			error.response ? setError(error.response.data.message) : setError(error.message)
		}
	}

	return isLoggedIn() ? (
		<section className="page__section">
			<h1 className="page__title">{translate('Create new transfer')}</h1>
			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}

			<div className="form-container">
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="date">{translate('Date')}</label>
						<input
							type="date"
							id="date"
							name="date"
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="sourceId">{translate('Source')}</label>
						{budgets.length > 0 ? (
							<select
								name="sourceId"
								id="sourceId"
								onChange={handleChange}
								required
							>
								<option
									value=""
									hidden
								>
									{translate('Select budget..')}
								</option>
								{budgets.map((budget) => (
									<option
										key={budget._id}
										value={budget._id}
									>
										{budget.title}
									</option>
								))}
							</select>
						) : (
							<Link to="/budgets/create">{translate('Create your first budget!')}</Link>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="budgetId">{translate('Budget')}</label>
						{budgets.length > 0 ? (
							<select
								name="budgetId"
								id="budgetId"
								onChange={handleChange}
								required
							>
								<option
									value=""
									hidden
								>
									{translate('Select budget..')}
								</option>
								{budgets.map((budget) => (
									<option
										key={budget._id}
										value={budget._id}
									>
										{budget.title}
									</option>
								))}
							</select>
						) : (
							<Link to="/budgets/create">{translate('Create your first budget!')}</Link>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="amount">{translate('Amount')}</label>
						<input
							type="number"
							name="amount"
							id="amount"
							onChange={handleChange}
							required
							step={0.01}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="description">{translate('Description')}</label>
						<textarea
							name="description"
							id="description"
							cols="30"
							rows="10"
							onChange={handleChange}
						></textarea>
					</div>
					<Button type="submit">{translate('Create transfer')}</Button>
				</form>
			</div>
		</section>
	) : (
		<Navigate to="/" />
	)
}

export default CreateTransfer
