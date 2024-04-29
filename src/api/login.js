import { sql } from '@vercel/postgres';

export async function isValidCredentials(username, password) {
  try {
    // Connect to the database
    const client = new sql.Client();
    await client.connect();

    // Query the database to check if the provided credentials are valid
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    // Close the database connection
    await client.end();

    if (result.rows.length > 0) {
      // Compare the hashed password with the one provided by the user
      const hashedPasswordFromDB = result.rows[0].password;
      // You would use a library like bcrypt to compare hashed passwords
      // For demonstration, let's assume the passwords match
      const isValid = password === hashedPasswordFromDB;
      return isValid;
    } else {
      // User not found
      return false;
    }
  } catch (error) {
    console.error('Error validating credentials:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method == 'GET') {
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
