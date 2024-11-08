/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress,
  Alert,
  Button,
  IconButton,
} from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import { getAllReports } from '../services/api';
import ResultDisplay from '../components/ResultDisplay';

function ReportItem({ report }) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <Paper key={report.analysisId} sx={{ mb: 2 }}>
      <ListItem>
        <ListItemText
          primary={`Report ID: ${report.analysisId}`}
          secondary={
            <>
              <Typography component="span" variant="body2">
                Company: {report.companyName}
              </Typography>
              <br />
              <Typography component="span" variant="body2">
                Analysis Date: {new Date(report.analysisDate).toLocaleDateString()}
              </Typography>
              <br />
            </>
          }
        />
        <IconButton onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
        {showDetails && (
          <Box sx={{ mt: 2, width: '100%' }}>
            <ResultDisplay result={report} allowSave={false} />
          </Box>
        )}
      </ListItem>
    </Paper>
  );
}

function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllReports();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
    return () => {
      setReports([]);
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/')} 
        sx={{ mb: 2 }}
      >
        Back to Home
      </Button>
      <Typography variant="h4" gutterBottom>
        Analysis Reports
      </Typography>

      {reports.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No reports available yet
          </Typography>
        </Paper>
      ) : (
        <List>
          {reports.map((report) => (
            <ReportItem key={report.analysisId} report={report} />
          ))}
        </List>
      )}
    </Box>
  );
}

export default Reports;