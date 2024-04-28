import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import axios from 'axios';

const ConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState('');

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

  return (
    <div>
      <Button variant="contained" onClick={testConnection}>Test Connection</Button>
      {connectionStatus && <Typography>{connectionStatus}</Typography>}
    </div>
  );
};

export default ConnectionStatus;
