import './UserSettings.css'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import CurrencySelect from '../../../components/CurrencySelect/CurrencySelect'
import { useState, useEffect } from 'react'
import Button from '../../../components/Button/Button'
import StatusMessage from '../../../components/StatusMessage/StatusMessage'
import axiosInstance from '../../../utilities/axiosconfig'
import LanguageSelect from '../../../components/LanguageSelect/LanguageSelect'

const UserSettings = () => {
	const { isLoggedIn, getUserSettings, getUserId, setAuthToken } = useAuth()
	const [settings, setSettings] = useState(getUserSettings())
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)
	const [translations, setTranslations] = useState(null)

	useEffect(() => {
		import(`../../../locales/languages/lang_${settings.language}.json`)
			.then((module) => setTranslations(module.default))
			.catch((error) => console.error('Translation file not found:', error))
	}, [settings])

	const translate = (key) => (translations ? translations[key] : key)

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
			<h1>{translate('Settings')}</h1>
			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}
			{success && (
				<StatusMessage
					type="success"
					message={translate(success)}
				/>
			)}
			<section>
				<h2>Visual</h2>
				<div className="settings__option settings__option--row">
					<label htmlFor="theme">{translate('Select website theme:')}</label>
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
						label={translate('Select website language:')}
						onChange={(e) => setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
					/>
				</div>

				<div className="settings__option settings__option--row">
					<CurrencySelect
						label={translate('Select default currency:')}
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
				{translate('Save settings')}
			</Button>
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default UserSettings
