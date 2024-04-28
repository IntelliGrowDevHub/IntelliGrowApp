import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    // Attempt to execute a simple query to check database connectivity
    await sql`SELECT 1`;
    res.status(200).end('Database is reachable');
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection error' });
  }
}
