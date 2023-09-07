require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Connected to MongoDB'))
	.catch((error) => console.error('MongoDB connection error:', error))

// Routes
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const budgetRoutes = require('./routes/budgetRoutes')
const incomeSourceRoutes = require('./routes/incomeSourceRoutes')
const incomeRoutes = require('./routes/incomeRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const transferRoutes = require('./routes/transferRoutes')
const debtRoutes = require('./routes/debtRoutes')

// Middlewares
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/budgets', budgetRoutes)
app.use('/api/incomes/source', incomeSourceRoutes)
app.use('/api/incomes', incomeRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/transfers', transferRoutes)
app.use('/api/debts', debtRoutes)

// Start the server
app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`)
})
