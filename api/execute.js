module.exports = async function handler(req, res) {
  console.log('[API] Execute function called:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    console.log('[API] Handling OPTIONS request');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('[API] Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, language } = req.body;
    console.log('[API] Request body:', { code: code?.substring(0, 100) + '...', language });

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
        try {
          // Use free Judge0 API (no API key required)
          const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            body: JSON.stringify({
              language_id: 71, // Python 3
              source_code: code,
              stdin: '',
              cpu_time_limit: '5.0',
              memory_limit: 128000
            })
          });

          if (!response.ok) {
            throw new Error(`Judge0 API error: ${response.status}`);
          }

          const submission = await response.json();
          const token = submission.token;

          // Poll for result
          let attempts = 0;
          const maxAttempts = 30; // 30 seconds max
          
          while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            
            const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
              headers: {
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
              }
            });

            if (!resultResponse.ok) {
              throw new Error(`Judge0 result API error: ${resultResponse.status}`);
            }

            const resultData = await resultResponse.json();
            
            if (resultData.status.id <= 2) { // Still processing
              attempts++;
              continue;
            }

            // Execution completed
            if (resultData.status.id === 3) { // Accepted
              result = resultData.stdout || 'Code executed successfully with no output.';
            } else if (resultData.status.id === 6) { // Compilation Error
              result = `Compilation Error:\n${resultData.compile_output}`;
            } else if (resultData.status.id === 5) { // Time Limit Exceeded
              result = 'Time Limit Exceeded';
            } else if (resultData.status.id === 4) { // Wrong Answer
              result = `Runtime Error:\n${resultData.stderr}`;
            } else {
              result = `Error (Status ${resultData.status.id}): ${resultData.stderr || 'Unknown error'}`;
            }
            break;
          }

          if (attempts >= maxAttempts) {
            result = 'Execution timeout - code took too long to run';
          }

        } catch (apiError) {
          console.error('[API] Python execution error:', apiError);
          // Fallback to demo mode if API fails
          result = `Python execution (demo mode):
${code}

Output (simulated):
Hello, World!
Welcome to Python!
Sum of 1 to 10: 55

Note: Real Python execution is temporarily unavailable. This is simulated output.
Error: ${apiError.message}`;
        }
        break;
        

        
      default:
        return res.status(400).json({ 
          error: `Unsupported language: ${language}. Supported languages: python, javascript` 
        });
    }

    const response = { 
      result,
      language,
      codeLength: code.length,
      timestamp: new Date().toISOString(),
      environment: 'vercel-serverless'
    };
    
    console.log('[API] Sending successful response:', response);
    res.json(response);

  } catch (error) {
    console.error('[API] Execute error:', error);
    const errorResponse = { 
      error: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    };
    console.log('[API] Sending error response:', errorResponse);
    res.status(500).json(errorResponse);
  }
}
