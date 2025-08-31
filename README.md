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

Start the backend server (from the root):

```bash
npm start
```

Start the frontend server (from `/client`):

```bash
cd client
npm start
```

## Testing

Test the core functionality:

```bash
node test-core.js
```

## API Endpoints

- `GET /` - API information
- `GET /api/health` - Health check
- `POST /api/execute` - Execute code
- `POST /api/cleanup` - Manual cleanup





