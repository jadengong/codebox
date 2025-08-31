# CodeBox - Multi-Language Code Execution Sandbox

A secure, full-stack code execution sandbox built with **React** and **Vercel Serverless Functions**. Write, run, and test code in multiple programming languages directly in your browser with real-time execution.

---

## ✨ Features

- **🔒 Secure Serverless Execution**
  - Each code submission runs in isolated Vercel serverless functions
  - Resource limits and timeout protection (10 seconds max)
  - No external dependencies or Docker required
- **🌍 Multi-language Support**
  - **JavaScript**: Full Node.js execution with console.log support
  - **Python**: Demo mode with print statement simulation
  - **Java**: Demo mode for code display
  - **C++**: Demo mode for code display
- **🧹 Smart Code Handling**
  - Automatic input validation and sanitization
  - Intelligent error formatting and display
  - Safe JavaScript execution environment
  - Demo mode for languages without runtime

---

## 🏗️ Tech Stack

| Layer        | Technology           | Details                    |
|-------------|---------------------|----------------------------|
| **Frontend**  | React 19 + CSS Modules | Modern UI with dark/light themes |
| **Backend**   | Vercel Serverless Functions | API endpoints with Node.js runtime |
| **Deployment**| Vercel Platform      | Zero-config deployment with CDN |
| **Security**  | Input Validation     | Code length and content validation |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Git**
- **Vercel account** (free)

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd code-execution-sandbox
npm install
```

### 2. Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### 3. Or Deploy via GitHub
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Deploy automatically

---

## 💻 Usage Examples

### JavaScript (Fully Functional)
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

### Python (Demo Mode)
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
print(f"Result: {result}")
```

### Java (Demo Mode)
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

### C++ (Demo Mode)
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
| `/api` | GET | API information and documentation |
| `/api/health` | GET | Health check and system status |
| `/api/execute` | POST | Execute code in specified language |

### Execute Code
```bash
POST /api/execute
Content-Type: application/json

{
  "code": "console.log('Hello, World!')",
  "language": "javascript"
}
```

---

## 🧪 Testing

Test the core functionality locally:
```bash
# Start local development
npm run dev

# Or test the API endpoints directly
curl http://localhost:3000/api/health
```

---

## 🛠️ Development

### Available Scripts
- `npm start` - Start local development server
- `npm run dev` - Start with nodemon for development
- `npm run build` - Build for production

### Project Structure
```
├── api/                   # Vercel serverless functions
│   ├── execute.js         # Code execution endpoint
│   ├── health.js          # Health check endpoint
│   └── index.js           # API information
├── client/                # React frontend
│   ├── src/
│   │   ├── Sandbox.jsx    # Main code editor
│   │   ├── LandingPage.jsx # Welcome page
│   │   └── *.css          # Styling
│   └── public/            # Static assets
├── vercel.json            # Vercel configuration
└── README.md              # This file
```

---

## 🔒 Security Features

- **Input Validation**: Code length and content validation
- **Timeout Protection**: 10-second execution limit
- **Safe Execution**: JavaScript runs in controlled environment
- **No File System Access**: Serverless functions are stateless
- **Resource Limits**: Vercel enforces function limits

---

## 🚀 Deployment

### Vercel (Recommended)
- **Zero configuration** deployment
- **Automatic scaling** and CDN
- **Serverless functions** for API
- **Git integration** for automatic deployments

### Alternative Platforms
- **Netlify**: Similar to Vercel
- **Railway**: For more complex backends
- **Render**: Good alternative

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
- Ensure you're using the deployed Vercel URL
- Check Vercel function logs for errors
- Verify API endpoints are accessible

### Code Execution Errors
- Check function timeout limits (10 seconds max)
- Verify code syntax and length limits
- Check Vercel function logs

### Deployment Issues
- Ensure `vercel.json` is properly configured
- Check build logs in Vercel dashboard
- Verify API routes are correctly mapped

---

## 💡 Notes

- **JavaScript execution** is fully functional on Vercel
- **Python, Java, C++** run in demo mode (no real execution)
- **For full execution** of all languages, consider deploying backend separately
- **This setup** is perfect for demos, portfolios, and JavaScript development

---

**Happy Coding! 🎉**





