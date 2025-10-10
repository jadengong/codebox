# Code Execution Sandbox

A full-stack, multi-language code execution sandbox built with **React**, **Node.js**, and **Docker**.  
Users can write code in the browser, select a language, and get real-time output from Docker containers.

---

## Features

- **Secure Docker-based execution**
  - Each submission runs in a short-lived container with no persistent state
- **Multi-language support**
  - Python and JavaScript
  - Write just `console.log("Hello")` or `print("Hi")`
- **Code formatting**
  - Auto-format Python and JavaScript code for better readability
  - Format button and keyboard shortcut (Ctrl+Shift+F)
- **Temp file cleanup**
- **Smart error formatting**
  - Cleans up messy compiler output to show what matters

---

## Tech Stack

| Layer        | Tech                 |
|-------------|----------------------|
| Frontend     | React + CSS          |
| Backend      | Node.js + Express    |
| Execution    | Docker (`python:3.11-slim`, `node:20-slim`) |
| Code Handling | `fs`, `uuid`, `child_process` |

--- 

## 💡 How It Works

1. Users type code and select a language in the frontend.
2. The backend saves the code to a temporary file.
3. Docker runs the code in a secure, language-specific container.
4. The output or error is captured and returned to the frontend.
5. The frontend displays the result in the browser.

---

## Project Structure

```
code-execution-sandbox/
├── backend/                    # Backend Node.js application
│   ├── src/
│   │   ├── controllers/        # API route handlers
│   │   ├── services/          # Business logic (code execution)
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
│   ├── API.md               # API documentation
│   ├── development/         # Development guides
│   └── deployment/          # Deployment guides
├── scripts/                  # Build/deploy scripts
├── docker/                   # Docker-related files
└── README.md                 # This file
```

## Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **Docker** (must be running)
- **npm** or **yarn**

### 1. Clone the repo

```bash
git clone https://github.com/jadengong/code-execution-sandbox
cd code-execution-sandbox
```

### 2. Install all dependencies

From the root directory:

```bash
npm run install:all
```

### 3. Start the development servers

**Option 1: Start both services (Recommended)**
```bash
npm run dev
```

**Option 2: Start services separately**

Start the backend server:
```bash
npm run dev:backend
# Backend will run on http://localhost:5000
```

Start the frontend server:
```bash
npm run dev:frontend
# Frontend will run on http://localhost:3000
# API calls will be automatically proxied to backend
```

## Testing

Test the core functionality:

```bash
# Start local development
npm run dev

# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend
```

## API Endpoints

- `GET /` - API information
- `GET /api/health` - Health check
- `POST /api/execute` - Execute code
- `POST /api/cleanup` - Manual cleanup

---

## 🚀 Getting Started

1. **Clone and install dependencies** (see Setup Instructions above)
2. **Start both services** with `npm run dev`
3. **Open your browser** to `http://localhost:3000` and start coding!

---


## Documentation

- **[API Documentation](docs/API.md)** - Complete API reference
- **[Development Guide](docs/development/DEVELOPMENT.md)** - Development setup and guidelines
- **[Deployment Guide](docs/deployment/DEPLOYMENT.md)** - Production deployment instructions

---

**Happy Coding! 🎉**

---

## Keyboard Shortcuts

- Ctrl + Enter: Run Code
- Ctrl + Shift + S: Load Example
- Ctrl + Shift + F: Format Code





