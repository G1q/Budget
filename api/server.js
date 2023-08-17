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
// const expenseRoutes = require('./routes/expenseRoutes');

app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
// app.use('/api/expenses', expenseRoutes);

// Start the server
app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`)
})
