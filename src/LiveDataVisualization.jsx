import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Paper, Typography, Button, Snackbar } from '@mui/material'; // Remove unused imports
import axios from 'axios';

const LiveDataVisualization = () => {
  const [liveData, setLiveData] = useState({});
  const [prediction, setPrediction] = useState('');
  const [predictionError, setPredictionError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
  const fieldColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  useEffect(() => {
    const fetchDataFromDB = async () => {
      try {
        const response = await axios.get('/api/serverless');
        if (response.status === 200) {
          const { channelID, apiKey } = response.data;
          setConnectionStatus('Database connection successful!');
          fetchDataFromThingspeak(channelID, apiKey);
        } else {
          setConnectionStatus('Database connection failed. Please check logs for details.');
        }
      } catch (error) {
        console.error('Error fetching data from database:', error);
        setConnectionStatus('Database connection failed. Please check logs for details.');
      }
    };

    fetchDataFromDB();
  }, []);

  const fetchDataFromThingspeak = async (channelID, apiKey) => {
    try {
      const response = await axios.get(
        `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=20`
      );
      if (response.status === 200) {
        const newData = {};
        response.data.feeds.forEach(feed => {
          Object.keys(feed).forEach(key => {
            if (key.startsWith('field')) {
              if (!newData[key]) newData[key] = [];
              newData[key].push({
                time: new Date(feed.created_at).toLocaleTimeString(),
                value: parseFloat(feed[key]),
              });
            }
          });
        });
        setLiveData(newData);
      }
    } catch (error) {
      console.error('Error fetching data from ThingSpeak:', error);
      setPredictionError('Failed to fetch data from ThingSpeak: ' + error.message);
    }
  };

  const handlePredict = () => {
    axios.post('https://flask-ten-smoky.vercel.app/predict', {
      data_fields: liveData, // Assuming liveData contains the necessary data for prediction
    })
    .then(response => {
      console.log('Prediction response:', response.data); // Log the response data
      setPrediction(response.data.length_prediction);
      setPredictionError('');
    })
    .catch(error => {
      if (error.response) {
        console.error('Server Error:', error.response);
        setPredictionError('Server responded with an error: ' + error.response.status);
      } else if (error.request) {
        console.error('No Response:', error.request);
        setPredictionError('No response from server.');
      } else {
        console.error('Error:', error.message);
        setPredictionError('Error: ' + error.message);
      }
    });
  };  

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Live Data Visualization
      </Typography>
      <Button variant="contained" color="primary" onClick={handlePredict} style={{ marginBottom: '20px' }}>
        Make Prediction
      </Button>
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        {prediction && (
          <Typography variant="subtitle1">Prediction: {prediction}</Typography>
        )}
        {predictionError && (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={() => setPredictionError('')}
            message={predictionError}
          />
        )}
      </div>
      {Object.keys(liveData).map((field, idx) => (
        <div key={field} style={{ marginTop: '20px' }}>
          <Typography variant="h6">{`Field ${field.replace('field', '')} Data`}</Typography>
          <LineChart width={500} height={300} data={liveData[field]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="time" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={fieldColors[idx % fieldColors.length]} activeDot={{ r: 8 }} />
          </LineChart>
        </div>
      ))}
      <Typography style={{ marginTop: '20px' }}>{connectionStatus}</Typography>
    </Paper>
  );
};

export default LiveDataVisualization;
