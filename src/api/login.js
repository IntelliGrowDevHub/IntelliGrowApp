// Import the necessary modules
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Check if the request method is not GET
  if (req.method === 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }

  // Extract username and password from query parameters
  let { username, password } = req.query;

  // Trim leading and trailing whitespace
  username = username.trim();
  password = password.trim();

  try {
    // Log the username for debugging
    console.log('Attempting login with username:', username);

    // Query the database to check if the provided username exists
    const userResult = await sql`
      SELECT * 
      FROM users 
      WHERE username = ${username}
      LIMIT 1
    `;

    // Check if any rows were returned
    if (userResult.rows.length === 0) {
      // Username does not exist
      console.log('Username does not exist:', username);
      return res.status(401).json({ success: false, error: 'Invalid username' });
    }

    // Username exists, now check the password
    const user = userResult.rows[0];

    if (user.password === password) {
      // Passwords match, login successful
      console.log('Login successful for username:', username);
      return res.status(200).json({ success: true });
    } else {
      // Password does not match
      console.log('Invalid password for username:', username);
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }
  } catch (error) {
    // Internal server error
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
