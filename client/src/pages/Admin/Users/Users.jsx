import { useEffect, useState } from 'react'
import './Users.css'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import axiosInstance from '../../../utilities/axiosconfig'

const Users = () => {
	const { getUserRole } = useAuth()
	const [users, setUsers] = useState([])

	const userRole = getUserRole()

	const getUsers = async () => {
		const response = await axiosInstance.get('admin/users')
		setUsers(response.data)
	}

	useEffect(() => {
		getUsers()
	}, [])

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm('Are you sure do you want delete this account?')

		if (confirmDelete) {
			try {
				const response = await axiosInstance.delete(`admin/users/${id}`)
				getUsers()
			} catch (error) {
				console.log(error)
			}
		}
	}

	return (
		<main className="admin-page">
			<h1 className="admin-page__main-title">Users</h1>

			<Link
				to="/admin/users/create"
				className="admin-page__create-btn"
			>
				Add new user
			</Link>

			<table className="admin-page__table">
				<thead>
					<tr>
						<th>Username</th>
						<th>Email</th>
						<th>Role</th>
						<th>Active</th>
						<th>Edit user</th>
						<th>Delete user</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user._id}>
							<td>{user.username}</td>
							<td>{user.email}</td>
							<td>{user.role}</td>
							<td>{user.active ? 'Yes' : 'No'}</td>
							<td>
								{user.role !== 'superadmin' ? (
									userRole === 'admin' && user.role === 'admin' ? (
										'-'
									) : (
										<Link
											className="admin-page__edit-btn"
											to={`/admin/users/edit/${user._id}`}
										>
											Edit
										</Link>
									)
								) : (
									'-'
								)}
							</td>
							<td>
								{user.role !== 'superadmin' ? (
									userRole === 'admin' && user.role === 'admin' ? (
										'-'
									) : (
										<button
											className="admin-page__delete-btn"
											onClick={() => handleDelete(user._id)}
										>
											&times;
										</button>
									)
								) : (
									'-'
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</main>
	)
}

export default Users
