import { createContext, useContext, useState } from 'react'
import jwt_decode from 'jwt-decode'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)

	const login = async (token) => {
		try {
			const decodedToken = jwt_decode(token)
			const userData = { token, ...decodedToken }
			setUser(userData)
		} catch (error) {
			console.error('Error decoding token:', error)
		}
	}

	const logout = () => {
		setUser(null)
	}

	return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	return useContext(AuthContext)
}
