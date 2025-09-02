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
          // Use Vercel Sandbox for real Python execution
          const { Sandbox } = require('@vercel/sandbox');
          
          const sandbox = await Sandbox.create({
            runtime: 'python3.13',
            timeout: 30000, // 30 seconds timeout
            resources: { vcpus: 1 }
          });

          // Write the Python code to a file in the sandbox
          await sandbox.writeFiles([
            { path: 'script.py', stream: Buffer.from(code) }
          ]);

          // Execute the Python script
          const execution = await sandbox.runCommand({
            cmd: 'python3',
            args: ['script.py']
          });

          // Capture output and errors
          let output = '';
          let errors = '';

          if (execution.stdout) {
            output = execution.stdout.toString();
          }
          
          if (execution.stderr) {
            errors = execution.stderr.toString();
          }

          // Clean up the sandbox
          await sandbox.destroy();

          // Combine output and errors
          if (errors) {
            result = `Error:\n${errors}\n\nOutput:\n${output}`;
          } else {
            result = output || 'Code executed successfully with no output.';
          }

        } catch (sandboxError) {
          console.error('[API] Sandbox execution error:', sandboxError);
          result = `Python execution error: ${sandboxError.message}`;
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
