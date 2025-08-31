# CodeBox - Multi-Language Code Execution Sandbox

A secure, full-stack code execution sandbox built with **React**, **Node.js**, and **Docker**. Write, run, and test code in multiple programming languages directly in your browser with real-time execution.

---

## ✨ Features

- **🔒 Secure Docker-based execution**
  - Each code submission runs in an isolated, short-lived container
  - Resource limits (100MB RAM, 0.5 CPU cores) prevent abuse
  - Network isolation for security
- **🌍 Multi-language support**
  - **Python**: Full support with auto-imports for typing, numpy, pandas, matplotlib
  - **JavaScript**: Node.js runtime with ES6+ support
  - **Java**: Auto-wrapped in Main class for easy snippet execution
  - **C++**: Auto-wrapped with proper includes and namespace
- **🧹 Smart code handling**
  - Automatic cleanup of temporary files
  - Auto-imports for common Python libraries
  - Intelligent error formatting and display
  - Timeout protection (10-15 seconds per execution)

---

## 🏗️ Tech Stack

| Layer        | Technology           | Details                    |
|-------------|---------------------|----------------------------|
| **Frontend**  | React 19 + CSS Modules | Modern UI with dark/light themes |
| **Backend**   | Node.js + Express    | RESTful API with validation |
| **Execution** | Docker Containers    | `python:3.11-slim`, `node:20-slim`, `openjdk:17-slim`, `gcc:13-slim` |
| **Security**  | Resource Limits      | Memory, CPU, and network isolation |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Docker** (running locally)
- **Git**

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd code-execution-sandbox
npm install
```

### 2. Start Backend
```bash
npm start
# Backend runs on http://localhost:3000
```

### 3. Start Frontend (new terminal)
```bash
cd client
npm install
npm start
# Frontend runs on http://localhost:3001
```

### 4. Open in Browser
Navigate to `http://localhost:3001` and start coding!

---

## 💻 Usage Examples

### Python with Type Hints
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i

# Test it
nums = [2, 7, 11, 15]
target = 9
solution = Solution()
result = solution.twoSum(nums, target)
print(f"Result: {result}")  # Output: [0, 1]
```

### JavaScript
```javascript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
    console.log(`F(${i}) = ${fibonacci(i)}`);
}
```

### Java
```java
// Just write the logic - no need for class wrapper!
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        System.out.println(i + " is even");
    } else {
        System.out.println(i + " is odd");
    }
}
```

### C++
```cpp
// Write your logic directly
vector<int> numbers = {1, 2, 3, 4, 5};
int sum = 0;
for (int num : numbers) {
    sum += num;
}
cout << "Sum: " << sum << endl;
```

---

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information and documentation |
| `/api/health` | GET | Health check and system status |
| `/api/execute` | POST | Execute code in specified language |
| `/api/cleanup` | POST | Manual cleanup of temporary files |

### Execute Code
```bash
POST /api/execute
Content-Type: application/json

{
  "code": "print('Hello, World!')",
  "language": "python"
}
```

---

## 🧪 Testing

Test the core functionality:
```bash
node test-core.js
```

This will run sample code in all supported languages to verify everything works.

---

## 🛠️ Development

### Available Scripts
- `npm start` - Start the backend server
- `npm run dev` - Start with nodemon for development
- `npm run cleanup` - Manual cleanup of temp files

### Project Structure
```
├── server.js              # Main server file
├── codeExecution.js       # Docker execution logic
├── routes/api.js          # API endpoints
├── client/                # React frontend
│   ├── src/
│   │   ├── Sandbox.jsx    # Main code editor
│   │   ├── LandingPage.jsx # Welcome page
│   │   └── *.css          # Styling
│   └── public/            # Static assets
└── temp/                  # Temporary execution files
```

---

## 🔒 Security Features

- **Container Isolation**: Each execution runs in a separate Docker container
- **Resource Limits**: Memory and CPU constraints prevent abuse
- **Network Isolation**: Containers have no network access
- **Auto-cleanup**: Temporary files are automatically removed
- **Input Validation**: Code length and content validation

---

## 🚀 Deployment

### Frontend (Vercel)
- Deploy the `client/` folder to Vercel
- Update API URLs to point to your backend

### Backend (Docker-supporting platforms)
- **Railway**: Excellent Docker support
- **Render**: Good for containerized apps
- **DigitalOcean App Platform**: Full Docker support
- **Heroku**: Traditional but reliable

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

This project is licensed under the ISC License.

---

## 🆘 Troubleshooting

### "Backend Disconnected"
- Ensure backend is running on port 3000
- Check Docker is running locally
- Verify no firewall blocking localhost

### Code Execution Errors
- Check Docker container logs
- Verify language syntax
- Ensure code doesn't exceed timeout limits

### Port Conflicts
- Backend uses port 3000
- Frontend automatically uses next available port (usually 3001)

---

**Happy Coding! 🎉**





