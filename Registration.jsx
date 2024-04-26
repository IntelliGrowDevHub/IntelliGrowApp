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

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="text" name="api_key" placeholder="ThingSpeak API Key" onChange={handleChange} />
      <input type="text" name="channel_id" placeholder="ThingSpeak Channel ID" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;
