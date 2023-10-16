import { Outlet } from 'react-router-dom'
import UserNav from '../components/UserNav/UserNav'
import styled from 'styled-components'

const UserMain = styled.main`
	display: grid;
	grid-template-columns: 200px 1fr;
	box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.2);
	margin-block: 1rem;
	padding: 0;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
		gap: 1rem;
	}
`

const UserLayout = () => {
	return (
		<UserMain>
			<UserNav />
			<Outlet />
		</UserMain>
	)
}

export default UserLayout
