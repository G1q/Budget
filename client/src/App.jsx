import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'

const App = () => {
	return (
		<Routes>
			<Route
				path="/"
				exact
				element={<h1>Homepage</h1>}
			/>

			<Route
				path="/register"
				element={<Register />}
			/>

			<Route
				path="/login"
				element={<Login />}
			/>
		</Routes>
	)
}

export default App
