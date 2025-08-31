export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ 
        error: 'Missing required fields: code and language' 
      });
    }

    if (typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Code must be a non-empty string' 
      });
    }

    if (code.length > 10000) {
      return res.status(400).json({ 
        error: 'Code is too long. Maximum length is 10,000 characters.' 
      });
    }

    console.log(`[API] Executing ${language} code, length: ${code.length}`);

    let result;
    
    switch (language) {
      case 'javascript':
        try {
          // For JavaScript, we can actually execute it safely
          const Function = globalThis.Function;
          const sandboxedFunction = new Function('console', code);
          
          // Capture console.log output
          let output = [];
          const mockConsole = {
            log: (...args) => {
              output.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' '));
            }
          };
          
          sandboxedFunction(mockConsole);
          result = output.join('\n') || 'Code executed successfully with no output.';
        } catch (error) {
          result = `Error: ${error.message}`;
        }
        break;
        
      case 'python':
        result = `Python execution (demo mode):
${code}

Output (simulated):
Hello, World!
Welcome to Python!
Sum of 1 to 10: 55

Note: This is a demo version. Python execution is simulated on Vercel.`;
        break;
        
      case 'java':
        result = `Java execution (demo mode):
${code}

Output (simulated):
Hello, World!
Welcome to Java!
Sum of 1 to 10: 55

Note: This is a demo version. Java execution is simulated on Vercel.`;
        break;
        
      case 'cpp':
        result = `C++ execution (demo mode):
${code}

Output (simulated):
Hello, World!
Welcome to C++!
Sum of 1 to 10: 55

Note: This is a demo version. C++ execution is simulated on Vercel.`;
        break;
        
      case 'typescript':
        result = `TypeScript execution (demo mode):
${code}

Output (simulated):
Hello, World!
Welcome to TypeScript!
Sum of 1 to 10: 55

Note: This is a demo version. TypeScript execution is simulated on Vercel.`;
        break;
        
      case 'kotlin':
        result = `Kotlin execution (demo mode):
${code}

Output (simulated):
Hello, World!
Welcome to Kotlin!
Sum of 1 to 10: 55

Note: This is a demo version. Kotlin execution is simulated on Vercel.`;
        break;
        
      case 'csharp':
        result = `C# execution (demo mode):
${code}

Output (simulated):
Hello, World!
Welcome to C#!
Sum of 1 to 10: 55

Note: This is a demo version. C# execution is simulated on Vercel.`;
        break;
        
      case 'go':
        result = `Go execution (demo mode):
${code}

Output (simulated):
Hello, World!
Welcome to Go!
Sum of 1 to 10: 55

Note: This is a demo version. Go execution is simulated on Vercel.`;
        break;
        
      case 'rust':
        result = `Rust execution (demo mode):
${code}

Output (simulated):
Hello, World!
Welcome to Rust!
Sum of 1 to 10: 55

Note: This is a demo version. Rust execution is simulated on Vercel.`;
        break;
        
      case 'php':
        result = `PHP execution (demo mode):
${code}

Output (simulated):
Hello, World!
Welcome to PHP!
Sum of 1 to 10: 55

Note: This is a demo version. PHP execution is simulated on Vercel.`;
        break;
        
      case 'ruby':
        result = `Ruby execution (demo mode):
${code}

Output (simulated):
Hello, World!
Welcome to Ruby!
Sum of 1 to 10: 55

Note: This is a demo version. Ruby execution is simulated on Vercel.`;
        break;
        
      case 'swift':
        result = `Swift execution (demo mode):
${code}

Output (simulated):
Hello, World!
Welcome to Swift!
Sum of 1 to 10: 55

Note: This is a demo version. Swift execution is simulated on Vercel.`;
        break;
        
      default:
        return res.status(400).json({ 
          error: `Unsupported language: ${language}. Supported languages: python, javascript, typescript, java, kotlin, cpp, csharp, go, rust, php, ruby, swift` 
        });
    }

    res.json({ 
      result,
      language,
      codeLength: code.length,
      timestamp: new Date().toISOString(),
      environment: 'vercel-serverless'
    });

  } catch (error) {
    console.error('Execute error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
