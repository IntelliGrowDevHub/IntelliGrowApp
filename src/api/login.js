// login.js
import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }

  // Extract username and password from query parameters
  let { username, password } = req.query;

  // Trim leading and trailing whitespace
  username = username.trim();
  password = password.trim();

  try {
    console.log('Attempting login with username:', username);
    
    // Establish database connection
    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false, // For development purposes, to ignore self-signed certificate errors
      },
    });

    await client.connect();

    // Query the database to check if the provided credentials are valid
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    await client.end();

    console.log('Result:', result);

    if (result.rows.length > 0) {
      // User authenticated successfully
      console.log('Login successful for username:', username);
      return res.status(200).json({ success: true });
    } else {
      // Invalid credentials
      console.log('Invalid username or password for username:', username);
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
