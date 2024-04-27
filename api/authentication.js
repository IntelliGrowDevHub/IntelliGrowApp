// authentication.js

const { Client } = require('pg');

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

client.connect();

async function authenticateUser(username, password) {
  try {
    const result = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}

module.exports = async (req, res) => {
  const { username, password } = req.body;

  try {
    const isAuthenticated = await authenticateUser(username, password);

    if (isAuthenticated) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
