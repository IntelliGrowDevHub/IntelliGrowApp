import { sql } from '@vercel/postgres';

export async function isValidCredentials(username, password) {
  try {
    // Connect to the database
    const client = new sql.Client();
    await client.connect();

    // Query the database to check if the provided credentials are valid
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    // Close the database connection
    await client.end();

    return result.rows.length > 0;
  } catch (error) {
    console.error('Error validating credentials:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { username, password } = req.body;

  try {
    // Validate the provided credentials
    const isValid = await isValidCredentials(username, password);

    if (isValid) {
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
