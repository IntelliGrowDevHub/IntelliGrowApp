import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, useTheme } from '@mui/material';
import axios from 'axios';

import backgroundImage from './intelligrow-high-resolution-logo.png';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();

  const handleLogin = async () => {
    try {
      // Send a POST request to the server to check if the user exists
      const response = await axios.post('/api/login', { username, password });
      
      if (response.data.success) {
        // User authenticated successfully
        onLogin(true);
      } else {
        // Invalid username or password
        setError('Invalid username or password');
      }
    } catch (error) {
      // Internal server error
      console.error('Error logging in:', error);
      setError('Internal server error');
    }
  };

  const handleCreateAccount = () => {
    // Add logic to create a new user account
    // This can be implemented based on your application requirements
    console.log('Create account clicked');
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

      {/* Login Form */}
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
          onKeyPress={handleKeyPress}
          color={theme.palette.mode === 'dark' ? 'secondary' : 'primary'} // Apply secondary color in dark mode
        />
        <TextField
          label="Password"
          fullWidth
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          color={theme.palette.mode === 'dark' ? 'secondary' : 'primary'} // Apply secondary color in dark mode
        />
        {error && <Typography variant="body2" style={{ color: 'red', marginTop: '10px' }}>{error}</Typography>}
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>
        <Button variant="text" color="primary" fullWidth onClick={handleCreateAccount}>
          Create New Account
        </Button>
      </Paper>
    </div>
  );
};

export default Login;
