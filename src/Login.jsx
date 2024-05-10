import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import backgroundImage from './intelligrow-high-resolution-logo.png';

const Login = ({ onLogin }) => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [channelId, setChannelId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const [users, setUsers] = useState([
    { username: 'demo', password: 'demo1234', api_key: '7P9PH9JZ7UNI88GJ', channel_ID: '2504684' },
    { username: 'intelligrow', password: 'success1234', api_key: '7P9PH9JZ7UNI88GJ', channel_ID: '2504684' },
    { username: 'hydroplants', password: 'data1234', api_key: '7P9PH9JZ7UNI88GJ', channel_ID: '2504684' },
    { username: 'indoor', password: 'np1234', api_key: 'ABDRFY4CEZN7AN96', channel_ID: '2543847'}
  ]);

  const handleLogin = () => {
    const user = users.find(u => u.username === loginUsername && u.password === loginPassword);
    if (user) {
      onLogin(true, user.api_key, user.channel_ID);
      setErrorMessage('');
    } else {
      setErrorMessage('Incorrect username or password');
    }
  };

  const handleLogout = () => {
    onLogin(false, '', ''); // Logout by passing empty strings for apiKey and channelID
  };

  const handleRegisterSubmit = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(loginUsername, loginPassword);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
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
        {errorMessage && (
          <Typography variant="body2" color="error" gutterBottom>
            {errorMessage}
          </Typography>
        )}
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          color={theme.palette.mode === 'dark' ? 'secondary' : 'primary'} // Apply secondary color in dark mode
        />
        <TextField
          label="Password"
          fullWidth
          type={showPassword ? 'text' : 'password'}
          margin="normal"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          color={theme.palette.mode === 'dark' ? 'secondary' : 'primary'} // Apply secondary color in dark mode
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary" fullWidth onClick={() => handleLogin(loginUsername, loginPassword)}>
          Login
        </Button>
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          Don't have an account? <span style={{ cursor: 'pointer', color: theme.palette.primary.main }} onClick={() => setIsDialogOpen(true)}>Register</span>
        </Typography>
      </Paper>
      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Registration Unavailable</DialogTitle>
        <DialogContent>
          <Typography>
            The registration page is currently unavailable. Please try again later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
