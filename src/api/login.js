import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Extract username and password from query parameters
    let { username, password } = req.query;

    // Trim leading and trailing whitespace
    username = username.trim();
    password = password.trim();

    try {
      console.log('Attempting login with username:', username);
      
      // Query the database to check if the provided credentials are valid
      const result = await sql`
        SELECT * 
        FROM users 
        WHERE username = ${username} AND password = ${password} 
        LIMIT 1
      `;

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
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}
