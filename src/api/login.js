import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  // Extract username and password from request body
  const { username, password } = req.body;

  try {
    console.log('Attempting login with username:', username);
    
    // A one-shot query
    const { rows } = await sql`SELECT * FROM users WHERE username = ${username} AND password = ${password}`;

    console.log('Result:', rows);

    if (rows.length > 0) {
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
