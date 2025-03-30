const { Pool } = require('pg'); // Import Postgresql Pool module to manage database connections
const dotenv = require('dotenv');

dotenv.config();

// Create new Pool instance with PostgreSQL credentials
const pool = new Pool({
    user: process.env.DB_USER,         // Username from .env
    host: process.env.DB_HOST,         // Host of the database (localhost or Docker container name)
    database: process.env.DB_NAME,     // Name of the database
    password: process.env.DB_PASSWORD, // Password from .env
    port: process.env.DB_PORT || 5432, // Default PostgreSQL port
});

module.exports = pool; 