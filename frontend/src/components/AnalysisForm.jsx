import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Typography 
} from '@mui/material';

function AnalysisForm({ onAnalyze }) {
  const [patentId, setPatentId] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze({ patentId, companyName });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Patent Infringement Analysis
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Patent ID"
            value={patentId}
            onChange={(e) => setPatentId(e.target.value)}
            margin="normal"
            required
            placeholder="e.g. US-RE49889-E1"
          />
          <TextField
            fullWidth
            label="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            margin="normal"
            required
            placeholder="e.g. Walmart Inc."
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2 }}
          >
            Analyze
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AnalysisForm; 