// Define interactions with the PostgreSQL database

const pool = require('../config/db')

// Insert new code execution record in DB
const createExecution = async (code) => {
    const query = 'INSERT INTO executions (code) VALUES ($1) RETURNING *';
    const values = [code];

    try {
        const res = await pool.query(query, values);
        return res.rows[0]; // Return inserted row
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports = { createExecution };
