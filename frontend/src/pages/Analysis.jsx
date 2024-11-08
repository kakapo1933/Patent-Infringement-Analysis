import React,{ useState } from 'react';
import { Box, Container, Alert, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AnalysisForm from '../components/AnalysisForm';
import ResultDisplay from '../components/ResultDisplay';
import { analyzePatent, saveAnalysisReport } from '../services/api';

function Analysis() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const analysisResult = await analyzePatent(formData);
      setResult(analysisResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')} 
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>
        <AnalysisForm onAnalyze={handleAnalyze} loading={loading} />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {result && <ResultDisplay result={result} />}
      </Box>
    </Container>
  );
}

export default Analysis;