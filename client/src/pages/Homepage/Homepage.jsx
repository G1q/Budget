import './Homepage.css'
import LogoutButton from '../../components/LogoutButton/LogoutButton'

const Homepage = () => {
	return (
		<div>
			<h1>Homepage</h1>
			{/* TODO: include button in header, now it's just for test */}
			<LogoutButton />
		</div>
	)
}

export default Homepage
