import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { username, password } = req.body;

  try {
    // Query the database to check if the provided credentials are valid
    // Replace 'users' with your actual user table name
    const result = await sql`SELECT * FROM users WHERE username = ${username} AND password = ${password}`;
    
    if (result.rows.length > 0) {
      // User authenticated successfully
      return res.status(200).json({ success: true });
    } else {
      // Invalid credentials
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
