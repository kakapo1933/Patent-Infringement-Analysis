import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load and parse JSON files
let patents = [];
let companies = { companies: [] };
let reports = [];

try {
  // Load patents data
  const patentsData = fs.readFileSync(path.join(__dirname, '../../data/patents.json'), 'utf8');
  patents = JSON.parse(patentsData);

  // Parse claims if they are strings
  patents = patents.map(patent => ({
    ...patent,
    claims: typeof patent.claims === 'string' ? JSON.parse(patent.claims) : patent.claims
  }));

  // Load companies data
  const companiesData = fs.readFileSync(path.join(__dirname, '../../data/company_products.json'), 'utf8');
  companies = JSON.parse(companiesData);

  // Load reports data if exists
  const reportsPath = path.join(__dirname, '../../data/reports.json');
  if (fs.existsSync(reportsPath)) {
    const reportsData = fs.readFileSync(reportsPath, 'utf8');
    reports = JSON.parse(reportsData);
  }
} catch (e) {
  const error = new Error(`Error loading JSON data: ${e.message}`);
  error.context = 'db';
  error.statusCode = 500;
  error.originalError = e;
  logger.error(error, error.context);
  throw error;
}

// Helper function to save reports to file
const saveReportsToFile = () => {
  try {
    fs.writeFileSync(
      path.join(__dirname, '../../data/reports.json'),
      JSON.stringify(reports, null, 2),
      'utf8'
    );
  } catch (e) {
    logger.error(`Error saving reports to file: ${e.message}`, 'db');
  }
};

export const db = {
  getPatent: (patentId) => {
    if (!patentId) {
      throw new Error('Patent ID is required');
    }
    const patent = patents.find(patent => patent.publication_number === patentId);
    if (!patent) {
      logger.error(`Patent not found: ${patentId}`, 'db');
    }
    return patent;
  },

  getCompany: (companyName) => {
    if (!companyName) {
      throw new Error('Company name is required');
    }
    const company = companies.companies.find(
      company => company.name.toLowerCase() === companyName.toLowerCase()
    );
    if (!company) {
      logger.error(`Company not found: ${companyName}`, 'db');
    }
    return company;
  },

  saveReport: (report) => {
    if (!report) {
      throw new Error('Report data is required');
    }

    const reportId = Date.now().toString();
    const newReport = {
      ...report,
      analysisId: reportId,
      analysisDate: new Date().toISOString()
    };
    reports.push(newReport);

    saveReportsToFile();

    return reportId;
  },

  getReport: (reportId) => {
    // TODO: Implement report retrieval
  },

  getAllReports: () => {
    try {
      const reportsData = fs.readFileSync(path.join(__dirname, '../../data/reports.json'), 'utf8');
      const reports = JSON.parse(reportsData);
      return reports.sort((a, b) => 
        new Date(b.analysisDate) - new Date(a.analysisDate)
      );
    } catch (error) {
      logger.error(`Failed to read reports.json: ${error}`, 'db');
      return [];
    }
  }
}; 