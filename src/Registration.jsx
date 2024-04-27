// RegistrationForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    api_key: '',
    channel_id: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/register', formData)
      .then(response => {
        console.log(response.data);
        // Redirect or show success message
      })
      .catch(error => {
        console.error(error.response.data.error);
        // Show error message
      });
  };
  const handleRegister = async () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [channelId, setChannelId] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [isRegistering, setIsRegistering] = useState(false); // State to track registration mode
    const theme = useTheme();

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

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="text" name="api_key" placeholder="ThingSpeak API Key" onChange={handleChange} />
      <input type="text" name="channel_id" placeholder="ThingSpeak Channel ID" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <button onclick={handleRegister} type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;
