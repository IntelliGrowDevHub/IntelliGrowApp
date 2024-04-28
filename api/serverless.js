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
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((error) => {
    console.error('Error connecting to PostgreSQL database:', error);
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

// Export the serverless function
module.exports = async (req, res) => {
  try {
    // Fetch data from the database
    const data = await fetchDataFromDB();
    
    // Send the data as JSON response
    res.status(200).json(data);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
