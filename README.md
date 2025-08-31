# Code Execution Sandbox

A full-stack, multi-language code execution sandbox built with **React**, **Node.js**, and **Docker**.  
Users can write code in the browser, select a language, and get real-time output from Docker containers.

---

## Features

- **Secure Docker-based execution**
  - Each submission runs in a short-lived container with no persistent state
- **Multi-language support**
  - Python, JavaScript, Java, and C++
- **Auto-wrapping for Java & C++**
  - Write just `cout << "Hello";` or `System.out.println("Hi");`
- **Temp file cleanup**
- **Smart error formatting**
  - Cleans up messy compiler output to show what matters

---

## Tech Stack

| Layer        | Tech                 |
|-------------|----------------------|
| Frontend     | React + CSS          |
| Backend      | Node.js + Express    |
| Execution    | Docker (`python:3.11-slim`, `node:20-slim`, `openjdk:17-slim`, `gcc:13-slim`) |
| Code Handling | `fs`, `uuid`, `child_process` |

--- 

## 💡 How It Works

1. Users type code and select a language in the frontend.
2. The backend saves the code to a temporary file.
3. Docker runs the code in a secure, language-specific container.
4. The output or error is captured and returned to the frontend.
5. The frontend displays the result in the browser.

---

## Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **Docker** (must be running)
- **Python** (v3.8 or higher, for optional Python backend)

### 1. Clone the repo

```bash
git clone https://github.com/jadengong/code-execution-sandbox
cd code-execution-sandbox
```

### 2. Install backend dependencies

From the root directory:

```bash
npm install
```

### 3. Install frontend dependencies

Navigate into the frontend `/client` folder:

```bash
cd client
npm install
```

### 4. Install Python dependencies (Optional)

If you want to run the Python backend or use Python tools:

```bash
# Install base requirements
pip install -r requirements.txt

# Install development dependencies
pip install -r requirements-dev.txt

# Install production dependencies only
pip install -r requirements-prod.txt
```

### 5. Start the backend and frontend 

**Option 1: Use the dev setup script (Recommended)**
```bash
npm run dev
```

**Option 2: Start services separately**

Start the backend server (from the root):
```bash
npm start
# Backend will run on http://localhost:5000
```

Start the frontend server (from `/client`):
```bash
cd client
npm start
# Frontend will run on http://localhost:3000
# API calls will be automatically proxied to backend
```

## Python Dependencies

The project includes several requirements files for different use cases:

- **`requirements.txt`** - Base dependencies for development and production
- **`requirements-dev.txt`** - Additional development tools, testing, and code quality tools
- **`requirements-prod.txt`** - Minimal production dependencies only

### Key Python Packages

- **Flask** - Web framework for Python backend
- **Docker** - Python Docker SDK for container management
- **pytest** - Testing framework
- **black** - Code formatting
- **flake8** - Linting and style checking

## Testing

Test the core functionality:

```bash
# Start local development
npm run dev

# Run backend tests
npm test

# Run frontend tests
cd client && npm test

# Test API endpoints manually
node test-api.js

# Test core functionality
node test-core.js
```

## API Endpoints

- `GET /` - API information
- `GET /api/health` - Health check
- `POST /api/execute` - Execute code
- `POST /api/cleanup` - Manual cleanup

---

## 🚀 Getting Started

1. **Clone and install dependencies** (see Setup Instructions above)
2. **Start the backend server** with `npm start`
3. **Start the frontend** with `cd client && npm start`
4. **Open your browser** and start coding!

---

## Development Tools

- **`dev-setup.js`** - Automated development environment setup
- **`test-api.js`** - Manual API endpoint testing
- **`test-core.js`** - Core functionality testing
- **`jest.setup.js`** - Jest testing configuration

---

**Happy Coding! 🎉**





