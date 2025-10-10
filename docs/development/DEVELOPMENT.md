# Development Guide

## Project Structure

```
code-execution-sandbox/
├── backend/                    # Backend Node.js application
│   ├── src/
│   │   ├── controllers/        # API route handlers
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utilities
│   │   └── middleware/        # Express middleware
│   ├── tests/                 # Backend tests
│   └── package.json
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── utils/            # Frontend utilities
│   │   ├── styles/           # CSS files
│   │   └── hooks/            # Custom React hooks
│   ├── public/               # Static assets
│   ├── tests/               # Frontend tests
│   └── package.json
├── shared/                    # Shared utilities/types
├── docs/                     # Documentation
├── scripts/                  # Build/deploy scripts
└── docker/                   # Docker-related files
```

## Prerequisites

- Node.js (v16 or higher)
- Docker (must be running)
- npm or yarn

## Setup

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Development Mode (Both Services)

From the root directory:

```bash
npm run dev
```

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### All Tests

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

## Code Style

- Use ESLint and Prettier for code formatting
- Follow standard JavaScript/React conventions
- Write meaningful commit messages
- Add tests for new features

## Adding New Languages

1. Update `backend/src/services/codeExecution.js` with new language config
2. Add Docker image and execution command
3. Update frontend language options
4. Add tests for the new language
5. Update documentation

## Environment Variables

### Backend

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

### Frontend

- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000)

## Docker Development

The project uses Docker for code execution. Ensure Docker is running and accessible:

```bash
docker --version
docker ps
```

## Debugging

### Backend Debugging

```bash
cd backend
npm run dev
# Server runs with nodemon for auto-restart
```

### Frontend Debugging

```bash
cd frontend
npm start
# Opens browser with React DevTools
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request
