const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const analyzePatent = async ({ patentId, companyName }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patentId, companyName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Analysis failed');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getReport = async (reportId) => {
  // TODO: Implement report retrieval
};

export const saveAnalysisReport = async (analysisData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysisData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save report');
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(`Error saving report: ${error.message}`);
  }
};

export const getAllReports = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/report`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching reports: ${error.message}`);
  }
}; 