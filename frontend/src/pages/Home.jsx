import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Patent Analysis System
      </Typography>
      
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Analyze patents and identify potential infringement risks
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/analysis')}
        >
          Start Analysis
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/reports')}
        >
          View Reports
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          How it works
        </Typography>
        <Typography variant="body1" paragraph>
          1. Enter a patent ID and company name
        </Typography>
        <Typography variant="body1" paragraph>
          2. Our AI analyzes the patent claims and company products
        </Typography>
        <Typography variant="body1" paragraph>
          3. Get detailed infringement risk analysis and recommendations
        </Typography>
      </Paper>
    </Box>
  );
}

export default Home; 