import { useEffect, useState } from 'react'
import './Users.css'
import axios from 'axios'

const Users = () => {
	const [users, setUsers] = useState([])

	useEffect(() => {
		const getUsers = async () => {
			const response = await axios.get('http://localhost:3002/api/admin/users')
			setUsers(response.data)
		}

		getUsers()
	}, [])

	return (
		<div>
			<h1>Users</h1>
			<ul>
				{users.map((user) => (
					<li key={user._id}>
						{user.username} : {user.email}
					</li>
				))}
			</ul>
		</div>
	)
}

export default Users
