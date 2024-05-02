import React, { useState } from 'react';
import Login from './Login'; 
import { CssBaseline, ThemeProvider, createTheme, Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import LiveDataVisualization from './LiveDataVisualization';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Import the logout icon
import IntelliGrowIcon from './intelligrow-favicon-color.png';

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [channelID, setChannelID] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = (isSuccessful, api_key, channel_ID) => {
    setLoggedIn(isSuccessful);
    setApiKey(api_key);
    setChannelID(channel_ID);
  };

  const handleLogout = () => {
    setDarkMode(false); // Turn off dark mode when logout is clicked
    setLoggedIn(false);
    setApiKey('');
    setChannelID('');
    handleClose();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ textAlign: 'center', padding: '20px' }}>
        {isLoggedIn ? (
          <>
            <LiveDataVisualization apiKey={apiKey} channelID={channelID} />
            <div style={{ position: 'absolute', top: 0, right: 0 }}>
              <Button
                aria-controls="resources-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
                endIcon={<ExpandMoreIcon />}
              >
                Resources
              </Button>
              <Menu
                id="resources-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={toggleDarkMode}>
                  <ListItemIcon>
                    <Brightness4Icon />
                  </ListItemIcon>
                  <ListItemText>Dark Mode</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => window.open('https://intelligrow.vercel.app/', '_blank')}>
                  <ListItemIcon>
                    <img src={IntelliGrowIcon} alt="IntelliGrow Icon" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                  </ListItemIcon>
                  <ListItemText>IntelliGrow Website</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppIcon /> {/* Add the logout icon */}
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </div>
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
