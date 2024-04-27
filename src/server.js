const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { createClient } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Generate JWT secret key
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('JWT Secret Key:', jwtSecret);

// Function to generate JWT token
const generateToken = (username) => {
  return jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
};

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    // Database connection
    const client = createClient({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    try {
      await client.connect();

      if (pathname === '/api/login' && req.method === 'POST') {
        // Handle login
        const { username, password } = query;
        const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
          const user = result.rows[0];
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err;
            }
            if (isMatch) {
              // Generate JWT token
              const token = generateToken(username);
              // Send success response with token
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ token }));
            } else {
              // Send error response for invalid credentials
              res.writeHead(401, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid credentials' }));
            }
          });
        } else {
          // Send error response for user not found
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'User not found' }));
        }
      } else if (pathname === '/api/register' && req.method === 'POST') {
        // Handle registration
        const { id, username, email, api_key, channel_id, password } = query;
        // Hash the password
        bcrypt.hash(password, 10, async (err, hash) => {
          if (err) {
            throw err;
          }
          try {
            // Insert user data into the database
            const query = `
              INSERT INTO users (id, username, email, api_key, channel_id, password) 
              VALUES ($1, $2, $3, $4, $5, $6)
            `;
            await client.query(query, [id, username, email, api_key, channel_id, hash]);
            // Send success response
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Registration successful' }));
          } catch (error) {
            console.error('Error inserting data:', error);
            // Send error response
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to register user' }));
          }
        });
      } else {
        // Let Next.js handle other routes
        await handle(req, res, parsedUrl);
      }
    } catch (error) {
      console.error('Error handling request:', error);
      // Send error response
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    } finally {
      // Close database connection
      await client.end();
    }
  }).listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
}).catch((error) => {
  console.error('Error starting the Next.js app:', error);
  process.exit(1);
});
