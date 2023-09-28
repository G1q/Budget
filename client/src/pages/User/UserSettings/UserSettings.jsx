import './UserSettings.css'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { labels } from '../../../translations/labels'

const UserSettings = () => {
	const { isLoggedIn, getUserSettings } = useAuth()

	const userSettings = getUserSettings()
	const userLanguage = userSettings.language

	return isLoggedIn() ? (
		<main>
			<h1>Settings</h1>
			<section>
				<h2>Visual</h2>
				<div className="settings__option settings__option--row">
					<label htmlFor="theme">{labels[0].translate[userLanguage]}</label>
					<select
						name="theme"
						id="theme"
					>
						<option value="light">Light (default)</option>
						<option value="dark">Dark</option>
					</select>
				</div>

				<div className="settings__option settings__option--row">
					<label htmlFor="items-per-page">Pagination items per page</label>
					<input
						type="number"
						name="items-per-page"
						id="items-per-page"
					/>
				</div>
			</section>

			<section>
				<h2>Languages and intl</h2>
				<div className="settings__option settings__option--row">
					<label htmlFor="language">Select website language:</label>
					<select
						name="language"
						id="language"
					>
						<option value="en">English (default)</option>
						<option value="ro">Romana</option>
					</select>
				</div>

				<div className="settings__option settings__option--row">
					<label htmlFor="currency">Select default currency:</label>
					<select
						name="currency"
						id="currency"
					>
						<option value="RON">RON (default)</option>
						<option value="EUR">EUR</option>
						<option value="USD">USD</option>
						<option value="GBP">GBP</option>
					</select>
				</div>
			</section>
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default UserSettings
