import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, useTheme, Typography } from '@mui/material';
import backgroundImage from './intelligrow-high-resolution-logo.png';
import axios from 'axios'; // Import axios for making HTTP requests

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
  const theme = useTheme();

  useEffect(() => {
    // Test the connection status when the component mounts
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Attempt to connect to the serverless function
      await axios.get('/api/serverless');
      setConnectionStatus('Connection successful!');
    } catch (error) {
      console.error('Error connecting to serverless function:', error);
      setConnectionStatus('Connection failed. Please check logs for details.');
    }
  };

  const testDatabaseConnection = async () => {
    try {
      // Attempt to connect to the database
      await axios.get('/api/database-connection');
      setConnectionStatus('Database connection successful!');
    } catch (error) {
      console.error('Error testing database connection:', error);
      setConnectionStatus('Database connection failed. Please check logs for details.');
    }
  };

  const handleLogin = async () => {
    // Make a request to the authentication endpoint
    try {
      const response = await axios.post('/api/authentication', { username, password });
      if (response.status === 200) {
        // If login is successful, set the isLoggedIn state to true
        onLogin(true);
      } else {
        // If login fails, show an error message
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Image with About Section */}
      <div style={{ flex: '1', position: 'relative', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: theme.palette.mode === 'dark' ? '#424242' : 'rgba(255, 255, 255, 0.8)', maxWidth: '70%', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            About
          </Typography>
          <Typography variant="body1">
            Welcome to IntelliGrow! Our Unit is a state-of-the-art hydroponic growing system, designed to empower enthusiasts like you to cultivate crops with precision and efficiency. Leveraging cutting-edge technology and sustainable practices, our system offers a controlled environment for year-round crop cultivation. With automated climate control, precise irrigation, and predictive plant height analysis powered by machine learning, we optimize resource utilization and ensure top-quality produce. Join us in revolutionizing home gardening and creating a greener, smarter, and more abundant future with IntelliGrow. Explore more on our webpage <a href="https://intelligrow.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>here</a>.
          </Typography>
        </div>
      </div>

      {/* Registration/Login Form */}
      {/* Inside the Paper component of the Login component*/}
      <Paper elevation={3} style={{ flex: '0 0 30%', padding: '20px', backgroundColor: theme.palette.mode === 'dark' ? '#424242' : 'rgba(255, 255, 255, 0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          color={theme.palette.mode === 'dark' ? 'secondary' : 'primary'}
        />
        <TextField
          label="Password"
          fullWidth
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          color={theme.palette.mode === 'dark' ? 'secondary' : 'primary'}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>
        {/* Render the ConnectionStatus component */}
        <Typography>{connectionStatus}</Typography>
      </Paper>

    </div>
  );
};

export default Login;
