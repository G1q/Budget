import axios from 'axios'

const axiosInstance = axios.create({
	baseURL: 'http://localhost:3002/api/',
})

// const axiosInstance = axios.create({
// 	baseURL: 'https://test5.bei-apa.ro:3002/api',
// })

export default axiosInstance
