// login.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  // Extract username and password from the request body
  const { username, password } = req.body;

  try {
    // Query the database to check if the provided credentials are valid
    const result = await sql`
      SELECT *
      FROM users
      WHERE username = ${username} AND password = ${password}
      LIMIT 1
    `;

    if (result.rows.length > 0) {
      // User authenticated successfully
      return res.status(200).json({ success: true });
    } else {
      // Invalid username or password
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
  } catch (error) {
    // Internal server error
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
