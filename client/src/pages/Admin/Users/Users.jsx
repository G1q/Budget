// Import dependencies
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'

// Import custom components
import ButtonLink from '../../../components/ButtonLink/ButtonLink'
import EditButton from '../../../components/EditButton/EditButton'
import DeleteButton from '../../../components/DeleteButton/DeleteButton'
import DataTable from '../../../components/DataTable/DataTable'
import StatusMessage from '../../../components/StatusMessage/StatusMessage'

// Import utilities
import axiosInstance from '../../../utilities/axiosconfig'

// Import styling
import './Users.css'

const Users = () => {
	const { getUserRole, isLoggedIn } = useAuth()
	const [users, setUsers] = useState([])
	const [error, setError] = useState(null)

	useEffect(() => {
		getUsers()
	}, [])

	const getUsers = async () => {
		try {
			const response = await axiosInstance.get('admin/users')
			setUsers(response.data)
		} catch (error) {
			error.response ? setError(error.response.data.message) : setError(error.message)
		}
	}

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this user account?')

		if (confirmDelete) {
			try {
				await axiosInstance.delete(`admin/users/${id}`)
				getUsers()
			} catch (error) {
				console.log(error)
				error.response ? setError(error.response.data.message) : setError(error.message)
			}
		}
	}

	return isLoggedIn ? (
		<main className="admin-page">
			<h1 className="admin-page__main-title">Users</h1>
			{error && (
				<StatusMessage
					type="error"
					message={error}
				/>
			)}
			<ButtonLink to="/admin/users/create">Add new user</ButtonLink>
			<DataTable cols={['Username', 'Email', 'Role', 'Active', 'Edit', 'Delete']}>
				{users.map((user) => (
					<tr key={user._id}>
						<td>{user.username}</td>
						<td>{user.email}</td>
						<td>{user.role}</td>
						<td>{user.active ? 'Yes' : 'No'}</td>
						<td>
							{user.role !== 'superadmin' ? (
								getUserRole() === 'admin' && user.role === 'admin' ? (
									'-'
								) : (
									<EditButton state={{ id: user._id }} />
								)
							) : (
								'-'
							)}
						</td>
						<td>
							{user.role !== 'superadmin' ? (
								getUserRole() === 'admin' && user.role === 'admin' ? (
									'-'
								) : (
									<DeleteButton onClick={() => handleDelete(user._id)} />
								)
							) : (
								'-'
							)}
						</td>
					</tr>
				))}
			</DataTable>
		</main>
	) : (
		<Navigate to="/" />
	)
}

export default Users
