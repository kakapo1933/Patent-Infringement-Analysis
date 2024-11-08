import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { analyzeService } from './services/analyzeService.js';
import { frontendService } from './services/frontendService.js';
import { logger } from './utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Global error handler
app.use((err, req, res, next) => {
  const errorMessage = err.statusCode && err.statusCode >= 400 && err.statusCode < 500 ? err.message : 'An error occurred while processing your request';
  logger.error(err, err.context || 'Global error handler');
  res.status(err.statusCode ? err.statusCode : 500).json({ error: errorMessage });
});

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:3002']
}));
app.use(helmet());
app.use(express.json());

// API routes
app.post('/api/analyze', async (req, res, next) => {
  try {
    const { patentId, companyName } = req.body;
    const analysis = await analyzeService.analyzePatent(patentId, companyName);
    res.json(analysis);
  } catch (error) {
    next(error);
  }
});

app.post('/api/report', async (req, res, next) => {
  try {
    const reportId = analyzeService.saveReport(req.body);
    res.json(reportId);
  } catch (error) {
    next(error);
  }
});

app.get('/api/report/:id', async (req, res, next) => {
  // TODO: Implement report retrieval
});

app.get('/api/report', async (req, res, next) => {
  try {
    const reports = analyzeService.getAllReports();
    res.json(reports);
  } catch (error) {
    next(error);
  }
});

// Frontend service
app.use('/', frontendService);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 