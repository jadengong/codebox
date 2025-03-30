const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const apiRoutes = require('./routes/api'); // import API routes

// Load env variables from .env file
dotenv.config();

const app = express(); // Create Express application
const port = process.env.PORT || 3000; // Set port from environment or default 

// To allow cross-origin requests
app.use(cors());

// To parse incoming JSON requests
app.use(express.json());

// Use imported API routes for handling those requests
app.use('/api', apiRoutes); // All API routes start with '/api'

// Define router handler for GET requests at root URL "/"
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start server and listen for requests
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})