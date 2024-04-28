// serverless-function.js

const { Client } = require('pg');

// Create a new PostgreSQL client instance
const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT, // Add this line if you have the port in your environment variables
});

// Connect to the database
client.connect();

// Define your database queries and operations
async function fetchDataFromDB() {
  try {
    const result = await client.query('SELECT * FROM your_table');
    return result.rows;
  } catch (error) {
    console.error('Error fetching data from database:', error);
    throw error;
  }
}

// Export the serverless function
module.exports = async (req, res) => {
    try {
      // Attempt to connect to the PostgreSQL database
      await client.connect();
      // If successful, send back a success response
      res.status(200).json({ success: true, message: 'Connection test successful' });
    } catch (error) {
      // If an error occurs, send back an error response
      console.error('Error connecting to PostgreSQL database:', error);
      res.status(500).json({ success: false, message: 'Error connecting to PostgreSQL database' });
    } finally {
      // Make sure to close the database connection
      await client.end();
    }
  };