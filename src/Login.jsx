import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import backgroundImage from './intelligrow-high-resolution-logo.png';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [channelId, setChannelId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // State to track registration mode
  const theme = useTheme();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { username, password });
      if (response.status === 200) {
        onLogin(true);
      } else {
        onLogin(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      onLogin(false);
    }
  };
  
  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/register', { username, password });
      if (response.status === 200) {
        // If registration is successful, automatically login the user
        handleLogin();
      } else {
        console.error('Registration failed:', response.data.error);
        // Handle registration failure
      }
    } catch (error) {
      console.error('Error during registration:', error);
      // Handle registration failure
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (isRegistering) {
        handleRegister();
      } else {
        handleLogin();
      }
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
          Register
        </Typography>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          color={theme.palette.mode === 'dark' ? 'secondary' : 'primary'}
        />
        {/* Add the additional fields for email, channelId, and apiKey here */}
        {isRegistering && (
          <>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color={theme.palette.mode === 'dark' ? 'secondary' : 'primary'}
            />
            <TextField
              label="ThingSpeak Channel ID"
              fullWidth
              margin="normal"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              color={theme.palette.mode === 'dark' ? 'secondary' : 'primary'}
            />
            <TextField
              label="ThingSpeak Read API Key"
              fullWidth
              margin="normal"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              color={theme.palette.mode === 'dark' ? 'secondary' : 'primary'}
            />
          </>
        )}
        {/* Rest of the registration form */}
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
        <Button variant="contained" color="primary" fullWidth onClick={isRegistering ? handleRegister : handleLogin}>
          {isRegistering ? 'Register' : 'Login'}
        </Button>
        <Button onClick={() => setIsRegistering(!isRegistering)} color="secondary">
          {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
        </Button>
      </Paper>

    </div>
  );
};

export default Login;
