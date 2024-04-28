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

// Function to test database connection
async function testDatabaseConnection() {
  try {
    // Attempt to connect to the PostgreSQL database
    await client.connect();
    // If successful, return true
    return true;
  } catch (error) {
    // If an error occurs, return false
    console.error('Error connecting to PostgreSQL database:', error);
    return false;
  } finally {
    // Make sure to close the database connection
    await client.end();
  }
}

// Export the serverless function
module.exports = async (req, res) => {
  try {
    const databaseConnected = await testDatabaseConnection();
    if (databaseConnected) {
      res.status(200).json({ success: true, message: 'Database connection successful' });
    } else {
      res.status(500).json({ success: false, message: 'Error connecting to PostgreSQL database' });
    }
  } catch (error) {
    console.error('Error testing database connection:', error);
    res.status(500).json({ success: false, message: 'Error testing database connection' });
  }
};
