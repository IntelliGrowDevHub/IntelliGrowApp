import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Paper, Typography, Button, Grid, Snackbar, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const LiveDataVisualization = ({ apiKey, channelID }) => {
  const [liveData, setLiveData] = useState({});
  const [prediction, setPrediction] = useState('');
  const [predictionError, setPredictionError] = useState('');
  const [data_fields, setDataFields] = useState({
    'day': 21,
    'ph': 7,
    'tds': 950,
  });
  const [chartType, setChartType] = useState('line'); // Default chart type
  const fieldColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  useEffect(() => {
    if (!apiKey || !channelID) return;

    const fetchData = async () => {
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
        console.error('Error fetching data:', error);
        setPredictionError('Failed to fetch data: ' + error.message);
      }
    };

    const interval = setInterval(fetchData, 10000);
    fetchData();
    return () => clearInterval(interval);
  }, [apiKey, channelID]);

  const handlePredict = () => {
    axios.post('https://flask-ten-smoky.vercel.app/predict', {
      data_fields: data_fields
    })
    .then(response => {
      //console.log('Prediction response:', response.data); // Log the response data
      console.log('Prediction response:', response.data); // Log the response data
      const roundedPrediction = parseFloat(response.data.length_prediction).toFixed(3); // Round off to 3 significant figures
      setPrediction(`${roundedPrediction} cm`);
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
    <Paper elevation={3} style={{ padding: '20px', margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center' }}>
        Welcome to IntelliGrow's Visualization
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
        <Typography variant="body1" gutterBottom style={{ display: 'flex', alignItems: 'left' }}>
          <NotificationsIcon style={{ marginRight: '10px' }} /> Receive alert notifications
        </Typography>
        <Typography variant="body1" gutterBottom style={{ display: 'flex', alignItems: 'center' }}>
          <TrackChangesIcon style={{ marginRight: '10px' }} /> Track your data here
        </Typography>
        <Typography variant="body1" gutterBottom style={{ display: 'flex', alignItems: 'center' }}>
          <AccessTimeIcon style={{ marginRight: '10px' }} /> 24/7 real-time monitoring
        </Typography>
      </div>
      <Grid container spacing={4} style={{ alignSelf: 'stretch' }}>
        {Object.keys(liveData).map((field, idx) => (
          <Grid item xs={12} md={6} key={field}>
            <Typography variant="h6">{`Field ${field.replace('field', '')} Data`}</Typography>
            <LineChart width={500} height={300} data={liveData[field]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="time" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type={chartType} dataKey="value" stroke={fieldColors[idx % fieldColors.length]} activeDot={{ r: 8 }} />
            </LineChart>
          </Grid>
        ))}
      </Grid>
      <Select
        value={chartType}
        onChange={(e) => setChartType(e.target.value)}
        style={{ marginTop: '20px' }}
      >
        <MenuItem value="line">Line Chart</MenuItem>
        <MenuItem value="area">Area Chart</MenuItem>
        <MenuItem value="scatter">Scatter Plot</MenuItem>
      </Select>
      <Button variant="contained" color="primary" onClick={handlePredict} style={{ marginTop: '20px' }}>
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
    </Paper>
  );
};

export default LiveDataVisualization;
