import React, { useState } from 'react';
import Login from './Login'; 
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import LiveDataVisualization from './LiveDataVisualization';

const theme = createTheme();

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogin = (isSuccessful) => {
    setLoggedIn(isSuccessful);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ textAlign: 'center', padding: '20px' }}>
        {isLoggedIn ? (
          <LiveDataVisualization /> // Use the LiveDataVisualization component
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;