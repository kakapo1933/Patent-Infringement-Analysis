# Patent Analysis System

A full-stack application for analyzing patent infringement risks using AI. The system compares patent claims against company products to identify potential infringement risks and provide detailed analysis reports.

## Features

- Patent infringement analysis using AI
- Company product comparison
- Detailed risk assessment reports
- Interactive web interface
- RESTful API backend
- Real-time analysis results

## Tech Stack

### Frontend
- React
- Material-UI
- Vite
- React Router

### Backend
- Node.js
- Express
- OpenAI GPT-4 API
- In-memory database

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- OpenAI API key

## Installation

### Standard Installation

1. Install dependencies:
```bash
# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

2. Configure environment variables:

Create `.env` files in both frontend and backend directories using the provided `.env.example` templates:

```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration
cp frontend/.env.example frontend/.env
```

Update the environment variables with your settings:
- Backend `.env`: Add your OpenAI API key and other configuration
- Frontend `.env`: Configure the API endpoint

### Docker Installation

1. Make sure you have Docker and Docker Compose installed on your system.

2. Configure environment variables as described above.

3. Build and run the containers:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3002
- Backend API: http://localhost:3001

To stop the containers:
```bash
docker-compose down
```

## Development

### Standard Development
1. Start the backend server:
```bash
cd backend
pnpm start
```

2. Start the frontend development server:
```bash
cd frontend
pnpm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Docker Development
For development with Docker:

1. Start the services in development mode:
```bash
docker-compose up
```

2. Watch logs:
```bash
docker-compose logs -f
```

3. Rebuild containers after making changes:
```bash
docker-compose up --build
```

## Production Deployment

> **Note**: Production deployment is not yet available. This feature is under development.

Key endpoints:
- `POST /api/analyze`: Submit patents for analysis
- `GET /api/reports`: Retrieve analysis reports
- `GET /api/reports/:id`: Get specific report details

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.