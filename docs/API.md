# API Documentation

## Overview

The Code Execution Sandbox API provides endpoints for executing code in various programming languages within secure Docker containers.

## Base URL

- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

## Endpoints

### Health Check

**GET** `/api/health`

Returns the health status of the API server.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "memory": {
    "rss": 50000000,
    "heapTotal": 20000000,
    "heapUsed": 15000000
  },
  "supportedLanguages": ["python", "javascript"]
}
```

### Execute Code

**POST** `/api/execute`

Executes code in the specified programming language.

**Request Body:**
```json
{
  "code": "print('Hello, World!')",
  "language": "python"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Code executed successfully",
  "result": "Hello, World!",
  "metadata": {
    "language": "python",
    "codeLength": 23,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "error": "Code is required and must be a non-empty string",
  "received": {
    "code": null,
    "language": "python"
  }
}
```

### Manual Cleanup

**POST** `/api/cleanup`

Manually triggers cleanup of temporary files.

**Response:**
```json
{
  "message": "Cleanup initiated",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Supported Languages

- **Python** (`python` or `py`)
- **JavaScript** (`javascript` or `js`)

## Error Codes

- `400` - Bad Request (invalid input, unsupported language)
- `500` - Internal Server Error (execution failure, system error)

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended for production deployments.

## Security

- Code execution is sandboxed in Docker containers
- Containers are destroyed after each execution
- Network access is disabled in execution containers
- Memory and CPU limits are enforced
