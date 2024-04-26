// server.js

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 5000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mySQL@2024',
  database: 'IntelliGrow'
});

db.connect((err) => {
  if (err) {
    console.log('Database connection error: ' + err.message);
  } else {
    console.log('Connected to the database');
  }
});

app.use(bodyParser.json());

// Registration endpoint
app.post('/register', (req, res) => {
  const { username, email, api_key, channel_id, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      db.query('INSERT INTO users (username, email, api_key, channel_id, password) VALUES (?, ?, ?, ?, ?)', [username, email, api_key, channel_id, hash], (err, result) => {
        if (err) {
          res.status(400).json({ error: 'Registration failed' });
        } else {
          res.status(200).json({ message: 'Registration successful' });
        }
      });
    }
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err || results.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({ username: user.username }, 'secret_key');
          res.status(200).json({ token });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
