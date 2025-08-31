const express = require('express')
const cors = require('cors')
const apiRoutes = require('./routes/api')

const app = express()
const port = process.env.PORT || 3000

// To allow cross-origin requests
app.use(cors())

// To parse incoming JSON requests
app.use(express.json())

// Use imported API routes for handling those requests
app.use('/api', apiRoutes)

// Define router handler for GET requests at root URL "/"
app.get('/', (req, res) => {
    res.send('Code Execution Sandbox API - Use /api/execute to run code')
})

// Start server and listen for requests
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})