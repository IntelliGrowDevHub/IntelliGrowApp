import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Paper, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar } from '@mui/material';
import axios from 'axios';

const LiveDataVisualization = () => {
  const [liveData, setLiveData] = useState({});
  const [apiKey, setApiKey] = useState('');
  const [channelID, setChannelID] = useState('');
  const [prediction, setPrediction] = useState('');
  const [predictionError, setPredictionError] = useState('');
  const [open, setOpen] = useState(false);
  const [data_fields, setDataFields] = useState({
    'day': 21,
    'ph': 7,
    'tds': 950,
  });
  const fieldColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];


  useEffect(() => {
    if (!apiKey || !channelID) return;

    //useEffect(() => {
    // Update dataFields whenever data_fields changes
    setDataFields((prevDataFields) => ({
      ...prevDataFields,
      ...data_fields
    }));
  

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
  }, [apiKey, channelID, data_fields]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSaveSettings = () => {
    setLiveData({});
    handleClose();
  };


  const handlePredict = () => {
  axios.post('https://flask-ten-smoky.vercel.app/predict', {
    data_fields: data_fields
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

  
  
  /* const handlePredict = () => {
    axios.post('https://flask-ten-smoky.vercel.app/predict', {
      apiKey: apiKey,
      channelID: channelID,
    })
    .then(response => {
      setPrediction(response.data.prediction);
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
*/
  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Live Data Visualization
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleOpen} style={{ marginBottom: '20px' }}>
        Set API Key and Channel ID
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter API Key and Channel ID</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="apiKey"
            label="API Key"
            type="text"
            fullWidth
            variant="outlined"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <TextField
            margin="dense"
            id="channelID"
            label="Channel ID"
            type="text"
            fullWidth
            variant="outlined"
            value={channelID}
            onChange={(e) => setChannelID(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveSettings}>Save</Button>
        </DialogActions>
      </Dialog>
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
      <Grid container spacing={4}>
        {Object.keys(liveData).map((field, idx) => (
          <Grid item xs={12} md={6} key={field}>
            <Typography variant="h6">{`Field ${field.replace('field', '')} Data`}</Typography>
            <LineChart width={500} height={300} data={liveData[field]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="time" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={fieldColors[idx % fieldColors.length]} activeDot={{ r: 8 }} />
            </LineChart>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default LiveDataVisualization;