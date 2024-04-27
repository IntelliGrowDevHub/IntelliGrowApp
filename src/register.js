// register.js
import { createClient } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id, username, email, api_key, channel_id, password } = req.body;

  const client = createClient({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    const query = `
      INSERT INTO users(id, username, email, api_key, channel_id, password) 
      VALUES($1, $2, $3, $4, $5, $6)
    `;
    await client.query(query, [id, username, email, api_key, channel_id, password]);
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  } finally {
    await client.end();
  }
}
