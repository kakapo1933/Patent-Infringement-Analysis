import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Serve static files from the frontend build directory with proper MIME types
router.use(express.static(path.join(__dirname, '../../../frontend/dist'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
  }
}));

// Handle any requests that don't match the API routes
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../frontend/dist', 'index.html'));
});

export const frontendService = router; 