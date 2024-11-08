import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  Divider,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { saveAnalysisReport } from '../services/api';
import { useState } from 'react';

function ResultDisplay({ result, allowSave = true }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  if (!result) return null;

  const handleSaveReport = async () => {
    try {
      const reportId = await saveAnalysisReport(result);
      setSnackbar({
        open: true,
        message: `Report saved successfully! Report ID: ${reportId}`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save report',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Analysis Results
          </Typography>
          {allowSave && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveReport}
              startIcon={<SaveIcon />}
          >
            Save Report
            </Button>
          )}
        </Box>
        
        {result.topInfringingProducts.map((product, index) => (
          <Box key={`${product.productName}-${index}`} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              {product.productName}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Infringement Likelihood: 
              <Chip 
                label={product.infringementLikelihood}
                color={product.infringementLikelihood >= 5 ? 'error' : 'warning'}
                size="small"
                sx={{ ml: 1 }}
              />
            </Typography>
            <Typography variant="body2" paragraph>
              {product.explanation}
            </Typography>
            
            <Typography variant="body2" gutterBottom>
              Relevant Claims:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {product.relevantClaims.map((claim) => (
                <Chip 
                  key={`${product.productName}-claim-${claim}`} 
                  label={`Claim ${claim}`} 
                  size="small" 
                />
              ))}
            </Box>
            
            <Typography variant="body2" gutterBottom>
              Specific Features:
            </Typography>
            <List dense>
              {product.specificInfringingFeatures.map((feature, idx) => (
                <ListItem key={`${product.productName}-feature-${idx}`}>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
            
            {index < result.topInfringingProducts.length - 1 && (
              <Divider sx={{ my: 2 }} />
            )}
          </Box>
        ))}
      </CardContent>

      <Snackbar 
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}

export default ResultDisplay;