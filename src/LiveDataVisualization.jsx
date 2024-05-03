import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Paper, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import PhDailyAverageChart from './PhDailyAverageChart';
import TdsDailyAverageChart from './TdsDailyAverageChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const initialDataFields = {
  'ph': 7,
  'tds': 950,
};

const LiveDataVisualization = ({apiKey, channelID}) => {
  const [liveData, setLiveData] = useState({});
  const [setApiKey] = useState('');
  const [setChannelID] = useState('');
  const [prediction, setPrediction] = useState('');
  const [predictionError, setPredictionError] = useState('');
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState('');
  const [dataFields, setDataFields] = useState(initialDataFields);
  const [loading, setLoading] = useState(false); // Added loading state
  const fieldColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  useEffect(() => {
    if (!apiKey || !channelID) return;
  
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}`
        );
        if (response.status === 200) {
          const newData = {};
          response.data.feeds.forEach(feed => {
            Object.keys(feed).forEach(key => {
              if (key.startsWith('field')) {
                if (!newData[key]) newData[key] = [];
                const time = new Date(feed.created_at);
                const formattedTime = format(time, 'yyyy-MM-dd HH:mm:ss');
                newData[key].push({
                  time: formattedTime,
                  value: parseFloat(feed[key]).toFixed(2),
                });
              }
            });
          });
          console.log('New data:', newData); // Log the fetched data
          setLiveData(newData);
          setPredictionError('');
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSaveSettings = () => {
    setLiveData({});
    handleClose();
  };

  const handlePredict = () => {
    setLoading(true); // Set loading to true when prediction is started
    const dayValue = parseInt(day, 10);
    if (isNaN(dayValue)) {
      setPredictionError('Please enter a valid day.');
      setLoading(false); // Set loading to false when prediction is done
      return;
    }

    const requestData = {
      data_fields: {
        day: dayValue,
        ph: dataFields['ph'],
        tds: dataFields['tds'],
      }
    };

    axios.post('https://flask-ten-smoky.vercel.app/predict', requestData)
      .then(response => {
        setPrediction(parseFloat(response.data.length_prediction).toFixed(2));
        setPredictionError('');
        setLoading(false); // Set loading to false when prediction is done
      })
      .catch(error => {
        console.error('Error:', error.message);
        setPredictionError('Error: ' + error.message);
        setLoading(false); // Set loading to false when prediction is done
      });
  };

  const calculateDailyAverages = () => {
    const dailyAverages = [];
    const threshold = 0; // Define threshold for valid values
    Object.keys(liveData).forEach(field => {
      const data = liveData[field];
      const averages = data.reduce((acc, curr) => {
        const date = curr.time.split(' ')[0]; // Extract date
        // Exclude outliers (values below the threshold)
        if (parseFloat(curr.value) < threshold) {
          return acc;
        }
        if (!acc[date]) {
          acc[date] = { count: 0, total: 0 };
        }
        acc[date].count++;
        acc[date].total += parseFloat(curr.value);
        return acc;
      }, {});
  
      Object.keys(averages).forEach(date => {
        dailyAverages.push({
          date,
          field, // Log the field property to ensure it's correct
          average: averages[date].total / averages[date].count,
        });
      });
    });
    return dailyAverages;
  };
  
  const dailyAverages = calculateDailyAverages();
  
  const phDailyAverages = dailyAverages.filter(item => item.field === 'field1');
  const tdsDailyAverages = dailyAverages.filter(item => item.field === 'field2');
  
  
  return (
    <div>
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
        <div style={{ marginBottom: '20px' }}>
          <Button variant="contained" color="primary" onClick={handlePredict}>
            Make Prediction
          </Button>
          <TextField
            id="day"
            label="Enter Day"
            type="number"
            variant="outlined"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </div>
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          {prediction && (
            <Typography variant="subtitle1">Prediction: {parseFloat(prediction).toFixed(2)} cm</Typography>
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
            <Grid item xs={12} key={field}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h6" gutterBottom>
                  {field === 'field1' ? 'pH' : field === 'field2' ? 'TDS' : `Field ${field.replace('field', '')}`} Data
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ flex: 2 }}>
                    <LineChart width={500} height={300} data={liveData[field]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="time" tickFormatter={(tick)=> format(new Date(tick), 'hh:mm:ss aa')} />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke={fieldColors[idx % fieldColors.length]} activeDot={{ r: 8 }} />
                    </LineChart>
                  </div>
                  <div style={{ flex: 1 }}>
                    {field === 'field1' && (
                      <div>
                        <Typography variant="h6" gutterBottom>
                          Daily Averages - pH
                        </Typography>
                        <PhDailyAverageChart data={phDailyAverages} />
                      </div>
                    )}
                    {field === 'field2' && (
                      <div>
                        <Typography variant="h6" gutterBottom>
                          Daily Averages - TDS
                        </Typography>
                        <TdsDailyAverageChart data={tdsDailyAverages} />
                      </div>
                    )}
                  </div>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </div>
  );
};

export default LiveDataVisualization;
