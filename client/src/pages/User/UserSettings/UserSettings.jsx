import './UserSettings.css'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { labels } from '../../../translations/labels'
import CurrencySelect from '../../../components/CurrencySelect/CurrencySelect'
import { useState } from 'react'
import Button from '../../../components/Button/Button'
import StatusMessage from '../../../components/StatusMessage/StatusMessage'
import axiosInstance from '../../../utilities/axiosconfig'
import LanguageSelect from '../../../components/LanguageSelect/LanguageSelect'

const UserSettings = () => {
	const { isLoggedIn, getUserSettings, getUserId, setAuthToken } = useAuth()
	const [settings, setSettings] = useState(getUserSettings())
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)

	const handleSubmit = async () => {
		try {
			const response = await axiosInstance.put(`users/edit/settings/${getUserId()}`, settings)
			setError(null)
			setSuccess(response.data.message)
			localStorage.setItem('token', response.data.token)
			setAuthToken(localStorage.getItem('token'))
			setSettings(getUserSettings())
		} catch (error) {
			setSuccess(null)
			error.response ? setError(error.response.data.message) : setError(error.message)
		}
	}

	return isLoggedIn() ? (
		<main>
			<h1>Settings</h1>
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
			<section>
				<h2>Visual</h2>
				<div className="settings__option settings__option--row">
					<label htmlFor="theme">{labels[0].translate[settings.language]}</label>
					<select
						name="theme"
						id="theme"
						defaultValue={settings.theme}
						onChange={(e) =>
							setSettings((prev) => ({
								...prev,
								[e.target.name]: e.target.value,
							}))
						}
					>
						<option value="light">Light</option>
						<option value="dark">Dark</option>
					</select>
				</div>
			</section>

			<section>
				<h2>Languages and intl</h2>
				<div className="settings__option settings__option--row">
					<LanguageSelect
						value={settings.language}
						label={labels[1].translate[settings.language]}
						onChange={(e) => setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
					/>
				</div>

				<div className="settings__option settings__option--row">
					<CurrencySelect
						label="Select default currency:"
						value={settings.currency}
						onChange={(e) =>
							setSettings((prev) => ({
								...prev,
								[e.target.name]: e.target.value,
							}))
						}
					/>
				</div>
			</section>

			<Button
				id="save-settings"
				onClick={handleSubmit}
			>
				Save settings
			</Button>
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default UserSettings
