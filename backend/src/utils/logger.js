import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, '../../logs');
const errorLogPath = path.join(logDir, 'error.log');
const gptLogPath = path.join(logDir, 'chat.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const timestampOptions = {
  timeZone: process.env.TZ || 'UTC',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
};

const getTimestamp = () => {
  return new Date().toLocaleString('en-US', timestampOptions).replace(',', '');
};

export const logger = {
  error: (error, context = '') => {
    const timestamp = getTimestamp();
    const errorMessage = error instanceof Error ? error.stack : error.toString();
    const logEntry = `[${timestamp}] ${context}\n${errorMessage}\n\n`;

    try {
      // Read existing logs
      fs.appendFileSync(errorLogPath, logEntry);
      // console.error('\x1b[31m%s\x1b[0m', logEntry); 
    } catch (err) {
      console.error('Failed to write error log:', err);
      console.error(logEntry);
    }
  },

  gpt: (message) => {
    if (!message || typeof message !== 'string') {
      throw new Error('Message is required and must be a string for GPT logging');
    }

    const timestamp = getTimestamp(); // Use the shared timestamp function
    const logEntry = `[${timestamp}] ${message}\n`;

    try {
      fs.appendFileSync(gptLogPath, logEntry);
    } catch (err) {
      console.error('Failed to write GPT log:', err);
      throw err;
    }
  }
};
