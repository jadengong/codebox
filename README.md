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

### 4. Start the backend and frontend 

**Option 1: Start with nodemon (Recommended)**
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
# PowerShell (Windows)
cd client; npm start

# Bash (macOS/Linux)
cd client && npm start
# Frontend will run on http://localhost:3000
# API calls will be automatically proxied to backend
```

## Testing

Test the core functionality:

```bash
# Start local development
npm run dev

# Run backend tests
npm test

# Run frontend tests
cd client && npm test
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
3. **Start the frontend** with `cd client; npm start` (PowerShell) or `cd client && npm start` (Bash)
4. **Open your browser** and start coding!

---


- **`jest.setup.js`** - Jest testing configuration

---

**Happy Coding! 🎉**

---

## Keyboard Shortcuts

- Ctrl + Enter: Run Code
- Ctrl + Shift + S: Load Example
- Ctrl + Shift + F: Format Code





